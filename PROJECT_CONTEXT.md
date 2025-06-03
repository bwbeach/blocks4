# Project Context

This file contains information for developers and AI assistants.  Information for the users of the web site is in [the README](README.md).

Note: This file is updated as the project evolves. It serves as a living document to maintain context and consistency throughout development. 

## Technical Stack

This application is an interactive web page built with HTML, CSS, jQuery, and Playwright.

## Architecture & Design Decisions

This is a single-page application that can be hosted as part of a static website.  The interactions all happen locally in the browser.


[High-level architecture decisions, patterns to follow, and any specific design constraints]

## Development Guidelines

I like to keep the HTML simple and streamlined, using semantic tags to show the structure and make the web site accessible.  To keep the styling consistent, most of the styles are define on generic tags like `h1` and `p`, without using classes.

Tests are built with Playwright and can be run from the command line using `npm test`.  Each Javascript class has thorough unit tests that test all the corner cases.  Interaction tests are minimal and are used to make sure that everything is connected together, not to test corner cases that can be covered by unit tests.

Run the page locally using the command line: (TODO: show the command to launch the app and open it)

Commits to git are small.  Each one is focused on a single change.

## Deployment & Infrastructure

The site is hosted as a static web site, and deployed by copying the source directory to the server using FTP.

## Notes for AI Assistant

I like to work in small steps: make one focused change, add a test for it, make sure all tests pass, and then commit.

If you see mistakes, speak up.  Offer alternatives when there are ways of doing things that might be better.

When committing a change to git, use a short summary of the changes as the first line in the commit message, followed by a verbatim transcript of the chat with the AI assistant since the last commit.

