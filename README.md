
**🏆 3rd Place Winner @ Bitcoin + AI Hackathon 2025**

# ClerkBit – A Tailored Digital Assistant For Any Business

Built in 24 hours for [**Plan ₿ Network**](https://planb.network/en)’s inaugural Hackathon in Lugano, this project earned us 🥉 3rd place out of 12 teams.

You can read more about our experience <a target="_blank" href="https://www.tio.ch/newsblog/lugano-s-plan-/1857066/lugano-network-bitcoin-plan-soluzioni-hackathon-lido">here</a>.

## What is ClerkBit?
It’s your digital employee who takes orders, answers questions, collects Bitcoin, and tracks order revenue.

## Key Features
It is your own in every sense of the word:
- you feed it your own your data
- you choose what AI model fits your needs
- you get to choose how you host your Bitcoin node

## Example Use Case
A café, shop, or service provider can run their own intelligent assistant in the following scenario:
1. A Lugano café installs the self-hosted app.
2. They configure the AI component of our app to serve as a chatbot that greets and take orders from customers.
3. Payments go directly to the café’s BTC wallet via Lightning NWC integration.
4. Locals or tourists interact with the app via QR code or web app in any language they prefer, paying in Bitcoin.

## What are we tackling with this solution?
Combining payments with AI can be extremely tricky; here comes ClerkBit into play, a fully-tailored digital assistant for any business. Our platform's main focus is to provide a secure and auditable solution that serves as an interface between the Lightning network, the merchant's services, and the customer. It empowers both business owners and customers, as it makes business processes quicker and costs lower. For this hackathon, we tailored our MVP to showcase a digital assistant in a café setting—reflecting Lugano’s café culture and its strong embrace of Bitcoin.

## To Run Our Project
- Front-end: 
  
  in `./clerkbit-app` run
```
npm i && npx expo start
```
- Back-end:
  
  in `./back-end` run
```
python main.py
```
- MCP Server:
  
  in `./back-end` run
```
python mcp-server.py
```

## Tech Stack
#### Front-end
Expo 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/expo/expo-original.svg" style="vertical-align: middle;" alt="Expo" width="20" height="20"/> (React Native)
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" style="vertical-align: middle;" alt="React Native" width="20" height="20"/>

#### Back-end
Flask
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/flask/flask-original.svg" style="vertical-align: middle;" alt="Flask" width="20" height="20"/> (Python)
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" style="vertical-align: middle;" alt="Python" width="20" height="20"/>

#### LLM

Anthropic API's *Sonnet 3.5*
<img src="https://cdn.simpleicons.org/anthropic" alt="Anthropic" style="vertical-align: middle;" width="20" height="20"/>

#### MCP Server

Model Context Protocol
<img src="https://mintlify.s3.us-west-1.amazonaws.com/mcp/mcp.png" alt="MCP" style="vertical-align: middle;" width="20" height="20"> (Python)
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" style="vertical-align: middle;" alt="Python" width="20" height="20"/>

#### Lightning NWC Integration
AlbyHub
<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/alby.svg" style="vertical-align: middle;" alt="Alby" width="20" height="20"/> + Alby SDK
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" style="vertical-align: middle;" alt="JavaScript" width="20" height="20"/>


