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

    Feature: hint history

        Scenario: view previous hints
            Given the user has requested multiple hints during a session
            When they scroll through the popup
            Then they should see a scrollable list of all previous hints with timestamps
            And the most recent hint should appear at the top

    Feature: problem metadata extraction

        Scenario: extract problem metadata from page
            Given the user is on a coding challenge page that displays difficulty, tags, or constraints
            When the content script extracts code
            Then it should also extract available metadata (difficulty level, problem tags, constraints)
            And include that metadata in the context sent to the LLM

    Feature: language-aware prompting

        Scenario: tailor LLM prompt to detected language
            Given the code editor indicates a specific programming language (e.g. Python, JavaScript, Java)
            When the user requests a hint
            Then the system prompt sent to the LLM should reference the detected language
            And the hint should include language-specific guidance

    Feature: settings validation

        Scenario: test API connection from settings
            Given the user has entered their LLM provider configuration
            When they click a Test Connection button on the settings page
            Then the extension should make a lightweight test call to the configured LLM
            And display whether the connection succeeded or failed with a clear message

        Scenario: validate API key format
            Given the user enters an API key on the settings page
            When the key does not match the expected format for the selected provider
            Then the settings page should show an inline validation warning before saving

    Feature: streaming responses

        Scenario: stream LLM response to popup
            Given the user has clicked Get Hint and the LLM is generating a response
            When tokens arrive from the LLM
            Then the popup should display the response incrementally as it streams in
            And show a subtle indicator that the response is still generating

    Feature: keyboard shortcut

        Scenario: request hint via keyboard shortcut
            Given the user is on a supported coding challenge page
            When they press Ctrl+Shift+H (or Cmd+Shift+H on macOS)
            Then the extension should request a hint without needing to open the popup

    Feature: configurable hint style

        Scenario: choose hint verbosity level
            Given the user opens the extension settings
            When they select a hint style (gentle nudge, detailed explanation, or pseudocode outline)
            And they request a hint
            Then the LLM system prompt should reflect the chosen style
            And the response should match the selected verbosity level

    Feature: additional supported sites

        Scenario: works on additional coding challenge platforms
            Given the user navigates to CodeSignal, Exercism, or AlgoExpert
            When the extension content script runs
            Then it should successfully identify and extract the code editor content

    Feature: robust markdown rendering

        Scenario: handle complex markdown without rendering artifacts
            Given the LLM returns a response with nested or mixed markdown (e.g. bold inside lists, adjacent bold and italic, code blocks with special characters)
            When the hint is displayed in the popup
            Then all markdown should render correctly without artifacts or broken formatting

    Feature: unsupported site handling

        Scenario: show friendly message on unsupported site
            Given the user is on a website that is not a supported coding challenge platform
            When they open the extension popup
            Then the popup should display a message explaining that the current site is not supported
            And list the supported platforms so the user knows where the extension works

    Feature: first-time onboarding

        Scenario: guide new user to configure API key
            Given the user has just installed the extension and has not configured an LLM provider
            When they open the extension popup for the first time
            Then the popup should display a welcome message with a clear link or button to open settings
            And it should not show the Get Hint button until a provider is configured

    Feature: keyboard shortcut result display

        Scenario: show hint result after keyboard shortcut
            Given the user has triggered a hint request via the keyboard shortcut
            When the LLM response is ready
            Then the extension should open the popup automatically and display the hint
            Or show a browser notification with a summary and a click-through to the full hint

    Feature: hint history persistence

        Scenario: persist hint history across popup open and close
            Given the user has received hints and then closes the popup
            When they reopen the popup on the same page
            Then the previous hints should still be visible

        Scenario: clear hint history on navigation
            Given the user has accumulated hints for a coding challenge
            When they navigate to a different problem or page
            Then the hint history should be cleared so it does not mix with the new problem

    Feature: code change impact on hints

        Scenario: indicate stale hints after code changes
            Given the user has received a hint and then modifies their code
            When the polling detects a code change
            Then existing hints should be visually marked as potentially stale
            And the Get Hint button should indicate that updated context is available

    Feature: large code handling

        Scenario: handle code that exceeds LLM token limits
            Given the extracted code is very large and may exceed the LLM context window
            When the user requests a hint
            Then the extension should truncate or summarise the code to fit within token limits
            And inform the user that the code was trimmed with a brief notice

    Feature: multi-tab awareness

        Scenario: use code from the active tab
            Given the user has multiple coding challenge tabs open
            When they open the extension popup
            Then the popup should display hints based on code from the currently active tab
            And switching tabs and reopening the popup should reflect the new tab's code

    Feature: offline detection

        Scenario: show offline state when network is unavailable
            Given the user has no network connection
            When they click Get Hint
            Then the popup should display a clear offline message instead of attempting the request
            And automatically retry or re-enable the button when connectivity is restored

    Feature: Mooch desktop integration

        Contract: Mooch Local Bridge API (must match Mooch desktop BDD.md)
            Base URL: http://localhost:62544
            All requests use Content-Type: application/json
            All requests must include header X-Mooch-Client: chrome-extension
            GET /health → { status, version, activeSession }
            GET /api/providers → { providers: [{ name, type, configured }] }
            POST /api/hint → request: { code, pageTitle, language, metadata, hintStyle } → response: { hint }
            POST /api/analyze → request: { code, context } → response: { analysis }

        Scenario: detect running Mooch desktop app
            Given the Mooch desktop app may or may not be running on the user's machine
            When the extension starts or the user opens the popup
            Then it should probe GET http://localhost:62544/health with header X-Mooch-Client: chrome-extension
            And display a connection indicator showing whether Mooch desktop is available

        Scenario: route hint requests through Mooch desktop
            Given the Mooch desktop app is running and detected via /health
            When the user requests a hint
            Then the extension should POST to http://localhost:62544/api/hint with { code, pageTitle, language, metadata, hintStyle }
            And display the returned { hint } in the popup as normal

        Scenario: fall back to standalone mode when Mooch is unavailable
            Given the Mooch desktop app is not running (GET /health fails or times out)
            When the user requests a hint
            Then the extension should use its own configured LLM provider as usual
            And not show any error about Mooch being unavailable

        Scenario: share provider configuration from Mooch desktop
            Given the Mooch desktop app is running
            When the user opens the extension settings
            Then the extension should call GET http://localhost:62544/api/providers
            And offer an option to use Mooch's configured providers so the user does not need to enter API keys separately

        Scenario: send extracted code to Mooch for analysis
            Given the Mooch desktop app is running and has code analysis capability
            When the extension extracts code from a coding challenge page
            Then it should be able to POST to http://localhost:62544/api/analyze with { code, context }
            And receive richer analysis that leverages Mooch's full provider stack

        Scenario: sync interview context from Mooch desktop
            Given the user has an active interview session in Mooch desktop (activeSession is not null in /health)
            When the extension requests a hint via POST /api/hint
            Then the Mooch desktop app will automatically include the interview's job description and resume context
            And the LLM response should be tailored to the specific role the user is interviewing for

    Feature: error recovery

        Scenario: retry failed hint request
            Given an LLM hint request has failed and an error is displayed
            When the user sees the error in the popup
            Then a Retry button should be shown alongside the error message
            And clicking Retry should re-send the hint request

    Feature: code panel display

        Scenario: render code blocks in a styled code panel
            Given the LLM returns a hint response containing a code solution or snippet
            When the hint is displayed in the popup
            Then any code blocks should be rendered inside a visually distinct "code panel"
            And the panel should use a monospace font with syntax highlighting
            And the panel should have a dark background to distinguish it from prose text
            And long code lines should scroll horizontally rather than wrap

    Feature: copy code button

        Scenario: copy code from a code panel
            Given a code panel is displayed in the popup
            When the user clicks the copy button (rendered using lucide-react Copy icon) in the top-right corner of the panel
            Then the code content should be copied to the clipboard
            And the button icon should briefly change to a Check icon to confirm the copy succeeded
            And after 2 seconds the button should revert to the Copy icon

    Feature: regenerate hint

        Scenario: Get Hint button changes to Regenerate after first hint
            Given the user has already received at least one hint for the current page
            When the popup is open
            Then the "Get Hint" button label should change to "Regenerate"
            And clicking "Regenerate" should request a new hint from the LLM
            And the new hint should be prepended to the hint history

    Feature: user context input

        Scenario: add user context to hint request
            Given the user opens the extension popup
            When a small collapsible context input panel is visible below the hint button
            And the user types additional context (e.g. "I am not allowed to use extra space") into the text area
            Then clicking Get Hint or Regenerate should include that context text in the LLM request payload alongside the extracted code
            And the LLM prompt should incorporate the user-provided context so the hint is tailored accordingly

    Feature: A readme that is friendly for users who just want to get started

        Background:
            Given All other features are implemented, so the readme does not need to be updated

        Scenario: A new user to the Mooch ecosystem
            Given a user is new to the repo
            When They go to the repo
            Then They should see an informative and intuitive README.
