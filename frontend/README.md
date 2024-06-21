<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list -->

<!-- 
folder structure
1- typescript function
2- custom hooks
3- components
4- mini-component
5- reusable function 
6- main app 
 -->


 bugs/pending work
 1-when reload with notes/id then notessection do not render -cause - mainstate
 2-when click on addnote then again click on addnote then new page should open and prv one save -done
 3- when i write note very fast first time then it render the new note name again ---- done
 4- new add note , rmove border form prv note
 5- some things need to done of when user save / update note name - imp
 6- copy and paste listeners
 7- notes name exceeding char
 8-on search show description also
 9-user profile
 10- logout btn
 11- check use login or not
 12 - home route -=
 13 - deafult page
 14-scroll styleing -
 15- logoutn btn
 16- add icons
 17- dark mode - 
 18- when search then rename notes name then come to default , chnaged note name do not reflect /show , old name showing
 19-delete and edit btn wrap in modal
 20- new name should be diffent from old name then send req, to serve
21 - resposive to mobile
22- when click outside the notes , name was't saved
23- when go the this route app/:id then noted whicj open do no get hover/bg-c

 //error handlinh
 //desscription max and min char
//note name max and min char 
//search error handling
// token expiry
//some wrong gone in server internallly
//when note name updated
//when note delete
//login and signup error
//when notedescitn load show loader or something
//when app load then show somthing cool
//when no notes peresnt or no seatch result get then show 'no result'

//in server
- need to chnage how db send notes like new notes come first , iressetive of condition