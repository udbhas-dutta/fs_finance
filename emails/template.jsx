import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import Head from "next/head";
import * as React from "react";

export default function EmailTemplate({
  username = "",
  type = "budget-alert",
  data = {},
}) {
  if (type === "monthly-report") {
  }
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {username},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used up {data?.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>₹{data?.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>₹{data?.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ₹{data?.budgetAmount - data?.totalExpenses}
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    margin: 0,
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "600px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "22px",
    lineHeight: "28px",
    fontWeight: 600,
    marginBottom: "16px",
    color: "#1a1a1a",
    textAlign: "center",
  },
  text: {
    fontSize: "14px",
    lineHeight: "20px",
    color: "#4a4a4a",
    margin: "8px 0",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "4px 0",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    padding: "16px",
    border: "1px solid #eaeaea",
    borderRadius: "6px",
    backgroundColor: "#fafafa",
  },
  stat: {
    flex: 1,
    textAlign: "center",
    padding: "0 8px",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    padding: "12px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "24px",
  },
};
