---
language: TypeScript
framework: chrome-extension, jest
build_cmd: npm run build
test_cmd: npm test
birth_date: 2026-03-07
---

System: a Chrome extension called Mooch Helper that assists users during technical interviews by extracting code from coding challenge websites and providing hints and tips via an LLM.

    Feature: code extraction

        Scenario: extract code from coding challenge page
            Given a user is on a coding challenge website (e.g. LeetCode, HackerRank, Codewars)
            When the page loads
            Then the extension should extract all code from the page as plain text

    Feature: hints and tips

        Scenario: display hints in popup
            Given the extension has extracted code from the page
            When the user opens the extension popup
            Then the popup should display LLM-generated hints and tips for the code challenge

        Scenario: user requests a hint via button
            Given the user has opened the extension popup on a supported coding challenge page
            When they click the Get Hint button
            Then the popup should show a loading state and then display the LLM response

    Feature: LLM integration

        Scenario: send code context to LLM
            Given code has been extracted from the page
            When the user requests a hint
            Then the extension should send the code and page context to an LLM and return a helpful response

    Feature: API key configuration

        Scenario: user can configure their API key
            Given the user has an Anthropic API key
            When they open the extension settings
            Then they should be able to enter and save their API key securely

        Scenario: Configure an open ai key
            Given A user has a key from an open ai compatible llm like qwen
            When add the api key, the base url and the model
            Then The model should be used.

        Scenario: Configure a local Ollama model
            Given a user has Ollama running locally with a model pulled
            When they open the extension settings and select OpenAI-compatible provider
            And they enter a localhost base URL (e.g. http://localhost:11434/v1) and a model name but no API key
            Then the extension should send hint requests to the local Ollama instance successfully

    Feature: supported sites

        Scenario: works on major coding challenge platforms
            Given the user navigates to LeetCode, HackerRank, Codewars, or CoderPad
            When the extension content script runs
            Then it should successfully identify and extract the code editor content

    Feature: intelligent code change detection

        Background:
            Given The user is logged in and there is code available.

        Scenario: detect and respond to code changes via polling
            Given the extension is active on a coding challenge page
            When the content script starts polling every 8 seconds
            Then it should compare the current code state with the previous one

    Feature: hint formatting

        Scenario: render markdown in hint responses
            Given the LLM returns a hint response containing markdown (headings, bold, italics, bullet lists, inline code, code blocks)
            When the hint is displayed in the popup
            Then the raw markdown syntax should not be visible
            And headings should appear as larger styled text
            And bold and italic text should be visually emphasised
            And bullet lists should render as proper list items
            And inline code should appear in a monospace styled format
            And fenced code blocks should render as a distinct styled code block with syntax preserved and horizontal scrolling if needed

    Feature: A readme that is friendly for users who just want to get started

        Background:
            Given All other features are implemented, so the readme does not need to be updated

        Scenario: A new user to the Mooch ecosystem
            Given a user is new to the repo
            When They go to the repo
            Then They should see an informative and intuitive README.
