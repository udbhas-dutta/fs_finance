import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // every 6 hours
  async ({ step }) => {
    console.log("🔎 Running budget alert check...");
    const budgets = await step.run("fetch-budgets", async () => {
      console.log("📥 Fetching budgets from DB...");
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    console.log(`✅ Found ${budgets.length} budgets.`);

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) {
        console.log(`⚠️ Skipping user ${budget.userId} - no default account.`);
        continue;
      }

      await step.run(`check-budget-${budget.id}`, async () => {
        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth()
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        console.log(
          `🧾 Checking budget ${budget.id} for user ${budget.user.email}, account: ${defaultAccount.name}`
        );

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        console.log(
          `➡️ Budget: ₹${budgetAmount}, Expenses: ₹${totalExpenses}, Used: ${percentageUsed.toFixed(
            1
          )}%`
        );

        // send alerts if user has used up over 80% of their budget
        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          console.log(
            `🚨 Sending budget alert email to ${budget.user.email} (Usage: ${percentageUsed.toFixed(
              1
            )}%)`
          );

          // send email
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              username: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          console.log(`✅ Email sent successfully to ${budget.user.email}`);

          // update lastAlertSent in the db
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });

          console.log(
            `📝 Updated lastAlertSent for budget ${budget.id} (${budget.user.email})`
          );
        } else {
          console.log(
            `ℹ️ No alert sent for ${budget.user.email} (Usage: ${percentageUsed.toFixed(
              1
            )}%).`
          );
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}
