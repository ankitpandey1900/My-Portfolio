# Section Registry

The Section Registry is the central dictionary for every loadable module within the Portfolio.

## Why a Registry?

Because Next.js and Webpack need statically analyzable import paths, we cannot do truly dynamic string interpolation like `import(sectionId)`.
Instead, the `SECTION_REGISTRY` will explicitly define the mapping of every `SectionId` to its corresponding `React.lazy` or `next/dynamic` import.

## Flow

1. Navigation intent targets `projects`.
2. `SectionResolver` looks up `projects` in the `SECTION_REGISTRY`.
3. The resolver verifies it exists and fetches the dynamic import thunk.
4. The `SectionLoaderController` executes the thunk and handles loading state.
