# Why port mashlib to React

The most important reason to port mashlib to a Create React App project is because we think *it is less work*. This has several reasons:

- Getting started with contributing to the mashlib is currently a mishmash of different projects all needing to be linked and built in the correct order. Being able to `git clone; npm install; npm start` makes a lot of difference.
- There's quite a lot of code in mashlib/solid-panes/solid-ui of which the purpose is unclear to new contributors. To some extent, that's just unfamiliarity with the code base, but for large parts of it the reason is simply that they were part of deprecated or unfinished projects, such as a Firefox extension or a protype link pane.
- We can make use of existing tools. For example, bugs like [#122](https://github.com/solid/solid-panes/issues/122) are prevented almost automatically by using a standard routing library. Tools like [Storybook](https://storybook.js.org/) need no custom configuration, meaning we can take advantage of e.g. their [accessibility features](https://github.com/storybookjs/storybook/tree/master/addons/a11y) without hefty setup or maintenance costs. Lazy loading is built in. The list goes on.
- We can avoid many of the bugs that are the result of code that was necessary from before Javascript modules were a thing, and hence had to assume certain properties to be set on `window`, or to provide a faux global `require` function.

Apart from speeding up our work and getting to a polished MVP quicker, the above points also lower the barrier to entry for additional contributors, who are more likely to be familiar with the ecosystem than they would be with e.g. solid-ui.

# MVP Requirements

With the following features, there would be enough functionality to be useful to people:

- [x] View RDF statements
- [x] Support Panes written in React or regular DOM
- [x] Log in/out
- [x] Link to relevant webapps
- [ ] Set application permissions
- [ ] ...

Soon after MVP:
- [ ] View your profile
- [ ] "Repair my data"
- [ ] Move data elsewhere (takeout)
- [ ] Access log

# How to use this

Start node-solid-server, then in this folder, run

```bash
npm install
npm start
```

A browser tab should then open at http://localhost:3000, with this Data Browser open. You can then log in to your NSS instance, likely using https://localhost:8443 as the URL.
