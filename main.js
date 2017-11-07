/** Node core */
const fs = require("fs");
const path = require("path");

/** Lodash Utilities */
const camelCase = require("lodash.camelcase");
const kebabCase = require("lodash.kebabcase");
const titleCase = require("lodash.capitalize");
const uppercaseFirst = require("lodash.upperfirst");

/** Packages */
const pkgDir = require("pkg-dir");

/** Custom globals */
const cliBasePath = path.dirname(__dirname) + "/" + path.basename(__dirname);
const projectPath = pkgDir.sync(process.cwd()) + "/";
const pjson = require(projectPath + "/package.json");
const ngCliConf = require(projectPath + "/.angular-cli.json");
const ngCliApp = ngCliConf.apps.length ? ngCliConf.apps[0] : ngCliConf.apps;
const args = process.argv.slice(2);
const types = args[0].split(",");
const name = args[1];
const argsWithValues = {};

/**
 * I'm using this to turn arguments into a more read-friendly object.
 * Later on, we'll just check for pre-defined arguments in the object and carry on accordingly.
 */
args.map(arg => {
  if (arg.match(/--[a-z]*-[a-z]*=[a-z]*/)) {
    const splitArg = arg.split("=");
    Object.assign(argsWithValues, {
      [splitArg[0]]: splitArg[1]
    });
  }
});

const main = () => {
  types.length > 1 ? processMultiple() : processSingle(types[0]);
};

const processMultiple = () => {
  // console.log("Processing multiple commands...");
  types.map(type => generateFile(type));
};

const processSingle = type => {
  // console.log("Processing a single command for type: " + type);
  switch (type) {
    case "all": {
      generateAll();
      break;
    }

    case "actions":
    case "reducers":
    case "effects":
    case "service": {
      generateFile(type);
      break;
    }

    default: {
      return "Unable to process";
    }
  }
};

const generateAll = () => {
  const allTypes = ["actions", "reducers", "effects", "service"];

  allTypes.map(type => {
    generateFile(type);
  });
};

const generateFile = type => {
  fs.readFile(cliBasePath + `/templates/_${type}.ts`, "utf8", (err, data) => {
    if (err) console.log("Error: " + err);
    const newData = performReplacements(data);
    writeFileFromStr(newData, type);
  });
};

const performReplacements = str => {
  str = str.replace(/{{ titleCase name }}/g, titleCase(name));
  str = str.replace(/{{ kebabCase name }}/g, kebabCase(name));
  str = str.replace(/{{ camelCase name }}/g, camelCase(name));
  str = str.replace(/{{ properCase name }}/g, uppercaseFirst(camelCase(name)));

  if (pjson["ngrx-generate"]) {
    const ngrxCliObj = pjson["ngrx-generate"];

    if (ngrxCliObj.rootStore) {
      if (ngrxCliObj.groupByName) {
        // return projectPath + ngrxCliObj.rootStore + "/" + name;
        // return `${projectPath}${ngrxCliObj.rootStore}/${name}/`;
        str = str.replace(/{{ position }}/g, ".");
      }
      // return projectPath + ngrxCliObj.rootStore + "/" + type;
      // return `${projectPath}${ngrxCliObj.rootStore}/${type}/`;
      str = str.replace(/{{ position }}/g, "../actions");
    }
  }

  return str;
};

const writeFileFromStr = (str, type) => {
  const writeLocation = determineWriteLocation(type);
  // console.log(writeLocation, "OUR WRITE LOCATION");
  if (!fs.existsSync(writeLocation)) fs.mkdirSync(writeLocation);
  fs.writeFile(writeLocation + `${name}.${type}.ts`, str, err => {
    if (err) console.error("Unable to write file: " + err);
  });
};

const determineWriteLocation = type => {
  if (pjson["ngrx-generate"]) {
    const ngrxCliObj = pjson["ngrx-generate"];

    if (ngrxCliObj.rootStore) {
      if (ngrxCliObj.groupByName) {
        // return projectPath + ngrxCliObj.rootStore + "/" + name;
        return `${projectPath}${ngrxCliObj.rootStore}/${name}/`;
      }
      // return projectPath + ngrxCliObj.rootStore + "/" + type;
      return `${projectPath}${ngrxCliObj.rootStore}/${type}/`;
    }
  }

  if (ngCliApp) {
    if (ngCliApp.root) {
      return `${projectPath}${ngCliApp.root}/`;
    }
  }
};

module.exports = main;
