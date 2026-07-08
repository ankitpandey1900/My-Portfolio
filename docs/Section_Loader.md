# Section Loader System

The Section Loader is the orchestrator responsible for loading dynamic React Chunks corresponding to a specific UI Section of the portfolio.

## Purpose

To keep initial bundle sizes tiny and performance high, the Portfolio UI sections (e.g. `Projects`, `Experience`, `About`) are NOT loaded immediately.
When a user selects a planet and travels to it:

1. `NavigationManager` registers the intent to open a section.
2. `SectionLoaderManager` intercepts this intent and commands the `SectionLoaderController`.
3. The `SectionLoaderController` initiates the async chunk fetching.
4. Only when the loader emits `SectionLoaded` does the UI fade in.

## Architecture

1. **`SectionLoaderManager`**: Connects the global navigation events to the local `SectionLoaderController`.
2. **`SectionLoaderController`**: Prevents duplicate fetching, handles chunk-fetching timeouts, and coordinates retries if a network error occurs while loading a section chunk.
3. **`SectionLoaderStore`**: Exposes the loading state (`resolving`, `loading`, `loaded`) so that global UI spinners can be rendered.
