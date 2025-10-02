# **App Name**: Cricket Exchange

## Core Features:

- Match Simulation: Simulate a 2-player, 5-over cricket match with configurable ball intervals and outcome probabilities. Supports strike changes and special ball outcomes like wides and no-balls.
- Order Book Management: Implement client-side order books for five markets: player1_score, player2_score, team_score, num_wickets, and num_boundaries.
- Order Matching Engine: Match orders based on price-time priority. Support partial fills and order cancellations.
- Live Trade Feed: Display executed trades in a live trade feed with timestamp, size, price, and buyer/seller labels.
- Position Tracking & PnL Calculation: Track player positions and calculate mark-to-market PnL. Compute final settlement PnL at match end using true final values.
- Dashboard & Market Pages: Create a dashboard with quick views of market data and a market detail page with order book, trade feed, and order entry.
- AI-Powered Strategy Tool: Provide an AI tool that analyzes the current game state and suggests potential trades based on learned strategies. The LLM will reason about when the available information could lead to a good outcome, and suggest the trade accordingly. This incorporates live match data, market conditions, and PnL to emulate sophisticated decision-making. This tool does not place trades on its own. The tool presents one or more specific and relevant suggestions that a human trader can then use, or not use, in placing the order.
- Onboarding & Demo Mode: Implement a one-click 'Play Demo Match' that runs an automated game and shows how to place/cancel an order, view PnL, and settle. Provide a short overlay walkthrough (3 steps) the first time a user visits: Dashboard → Enter market → Place order.
- Default Settings & Presets: Provide clear default settings & sensible presets, including a ball interval default of 25s (configurable 20–30), configurable outcome probabilities with defaults shown in Settings, and default order tick sizes and min/max prices per market prefilled in order entry.
- Error Handling & Confirmations: Implement error handling and confirmations, including inline validation and friendly messages for bad inputs, confirmation for destructive actions (cancel all orders, reset match), and an undo feature for recent cancellations (5–10s window).
- Explainable AI Suggestions: Ensure AI gives specific trades + rationale + confidence + risks, never executes automatically. Provide a 'Why this trade?' expandable explanation (short bullets + numeric signals).
- Performance & Persistence: Optimize performance and persistence by using localStorage with clear export/import (JSON) so users can save matches locally. Debounce heavy UI updates (orderbook) and virtualize long lists (trade feed).
- Accessibility & Mobility: Ensure accessibility and mobility by implementing 4.5:1 contrast for body text, keyboard navigation, ARIA labels for order form & orderbook, and a responsive layout that stacks columns vertically on narrow screens and keeps order entry easy to reach.
- UI/Interaction Details: Implement concrete UI/interaction details, including dashboard tiles with market name, last trade, best bid / best ask, your net position, and a quick action button 'Open'. Market page layout should feature the Orderbook (buy side descending on left, sell side ascending on right), a Live Trade Feed (newest at top, small badges for BUY/SELL, timestamp, size, price), and Order Entry (Direction toggle, Price input + quick buttons, Volume, Place Order).
- Orderbook Behaviors: Define orderbook behaviors, including clicking a price to pre-fill the Price input and a quick 'Market Sweep' button that suggests crossing the best opposite price (with warnings).
- Tooltips & Microcopy: Incorporate tooltips and microcopy for enhanced usability, such as a tooltip on free-hit stating 'Free Hit — wickets disabled; boundary probabilities increased' and on cancel stating 'Cancel order — will remove your order from the book immediately'.
- AI-Powered Strategy Tool Design: Design the AI-Powered Strategy Tool with specific inputs to the LLM (structured JSON) and a strict LLM output schema including suggestions with market, action, price, volume, rationale, confidence, and risk notes.
- UI for AI Suggestions: Design the UI for AI suggestions to show 1–3 suggestions max, each with quick action buttons: 'Pre-fill Order', 'Copy to Order Entry', 'Dismiss'. Show an expandable 'Why?' with contributing signals and a confidence meter.
- Safety & Trust for AI Suggestions: Implement safety & trust measures for AI suggestions, always requiring user confirmation to place orders, showing a provenance line, and displaying the last refresh time of data used for the suggestion.
- Sample LLM Prompt: Start with a sample LLM prompt for the trading assistant role, emphasizing trade suggestions with rationale, confidence, and risk notes, while avoiding exceeding position limits and focusing on explaining why.
- Usability Features: Add usability features such as quick presets ('Small test order', 'Aggressive sweep', 'Passive maker'), visual indicators (filled orders animate into trade feed, color badges for ball events), and keyboard shortcuts (N = New order focus, Enter = submit, Esc = cancel, Space = step ball).
- Leaderboard Filters & Export: Implement leaderboard filters by market / global / time range and PnL export to CSV.
- Fonts and Accessibility: Define fonts (Inter and Source Code Pro) and ensure color contrast ratio ≥ 4.5:1 for body text and 3:1 for large headlines.
- Testing & Acceptance Criteria for Usability: Establish testing & acceptance criteria for usability, including new user onboarding, inline error display, AI suggestion display, keyboard/screen-reader navigation, and order matching correctness.
- Small Technical Notes: Address small technical notes, including re-bowling on wides, free-hit adjustments to RNG, localStorage collisions, and configurable bot behavior.

## Style Guidelines:

- Primary color: Vibrant orange (#FF8C00) to capture the dynamic energy of trading and sports.
- Background color: Light gray (#F0F0F0), almost white, provides a neutral backdrop for content, ensuring readability.
- Accent color: Teal (#008080) to highlight key interactive elements.
- Body and headline font: 'Inter' sans-serif for a clean, modern, neutral interface suitable for data-rich display.
- Code font: 'Source Code Pro' for displaying code snippets and logs in a clear, readable format.
- Dashboard: Use tiles for quick market overviews. Market Page: Order Book on left, Trade Feed center, Order Entry on right.
- Use clear, minimalistic icons to represent different market actions and game events.
- Background: #0F172A (dark navy) or #FFFFFF (light) — provide both for theme switch.
- Surface / cards: #0B1220 (dark) / #F8FAFC (light).
- Primary accent: #06B6D4 (teal-cyan) — actionable buttons.
- Success: #10B981, Warning: #F59E0B, Danger: #EF4444.
- Text primary: #E6EEF8 (dark theme) / #0F172A (light).