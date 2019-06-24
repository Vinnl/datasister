This started out as an experiment to find out whether the React/vanilla Pane approach could also work the other way around: loading a Pane written in vanilla JS in a React app.

I got to a working Data Browser with so little effort, that I decided to polish it up a bit. Here I'll evaluate the pros and cons of this project.

# Pros

This approach already ticks many of the revamp boxes, in very little time. We have:

- Same API interface as mashlib (for loading from the server), and towards Panes
- Preservation of the ability to use whatever framework (or none at all) one wants when writing Panes.
- A focus on a11y for everything that's included, insofar as the style guide allows it.
- A safer and more intuitive interface. But: it could still be a lot better. Iterating on the interface is a lot easier, though.
- Far less custom tooling and architecture, so easier on-boarding for new developers. Pane code, too, is learly delineated.
- We can lean on all debugging and other tools of the React community.
- Use of the Style Guide.
- A *far* easier build setup, and no hassles with `npm link`.
- Easy to write unit tests for the rest of the Data Browser as well.
- TypeScript support.
- No more folding and removal of all Panes, nor hover-to-reveal.
- Global navigation.
- Easier to discern between logged in and out.
- A start at a home page - though it's still covered up by the `index.html` in the user's Pod.

Additionally, using React it's really easy to do lazy-loading of Panes at the moment when they are needed.

I also experimented with opening apps that then automatically log in to the Pod. This feels like a good approach to:

1. Keep the scope of the Data Browser project relatively limited (i.e. only reading data) and thus easier to get to a state where it can start providing value to people.
2. Makes it easier for us to involve third-party contributors. For example, we could work with the UX team to have them design simple apps that complement the Data Browser by actually manipulating data, and then put out a call on the forum calling for people to work on those. They're not dependent on submitting pull requests to us, or on us having to deploy their code, so they can move quickly. When they get to a good state, we can still link to those apps from the Data Browser for a relatively seamless experience.

# Cons

In effect, this is practically a complete rewrite of the Data Browser. That means that it does not currently support practically all of the Panes that the current Data Browser does.

The effects of this are somewhat mitigated by the fact that the Panes here conform to practically the same API as we used for the Panes we used in our SoC experiments. Given that we'll likely have to touch most of them anyway to get their UX up to scratch, "porting" them to this version might not be _that_ much work. Additionally, given that this version can run as a separate app and also uses the style guide, we could try an approach in which updated Panes work in both versions.

Another potential downside is that this rewrite does not support nested folders, or opening Panes next to each other. This could potentially be added later, but to keep the UX and implementation simple for now, this is not implemented.

# MVP Requirements

With the following features, there would be enough functionality to be useful to people:

- [x] View RDF statements
- [x] Support Panes written in React or regular DOM
- [x] Log in/out
- [x] Link to relevant webapps
- [ ] Set application permissions
- [ ] View your profile (is this actually required)?

# How to use this

This project is compatible with the way mashlib is loaded in [the `mashlib-bundle` branch](https://github.com/solid/node-solid-server/pull/1218) of node-solid-server. Thus, check that out, then...

- in `lib/create-app.js`, replace

```diff
-  app.use('/', express.static(path.join(__dirname, '../node_modules/mashlib/dist'), { index: false }))
+  app.use('/', express.static(path.join(__dirname, '../../datasister/build'), { index: false }))
```

- in `lib/handlers/get.js`, replace

```diff
-      const defaultDataBrowser = _path.join(__dirname, '../../node_modules/mashlib/dist/index.html')
+      const defaultDataBrowser = _path.join(__dirname, '../../../datasister/build/index.html')
```

Make sure to refer to the correct path of the datasister repository. Then run `npm install; npm run build` in the datasister repository, start node-solid-server, and you should be good to go!
