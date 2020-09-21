var fs = require('fs');
var path = require('path');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var InspectModule = require("docxtemplater/js/inspect-module");
export default {
  getVariable(docx) {
    var content = fs
      .readFileSync(path.resolve(__dirname, "..", "doc", docx), 'binary');
    var zip = new PizZip(content);
    var iModule = InspectModule();
    const doc = new Docxtemplater(zip, {
      modules: [iModule]
    });
    doc.render();
    var tags = iModule.getAllTags();
    var tagsArr = [];
    for (var key in tags) {
      tagsArr.push(key)
    }
    return tagsArr;
  },

  text(name_doc, set_data) {

    // The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
    function replaceErrors(key, value) {
      if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function(error, key) {
          error[key] = value[key];
          return error;
        }, {});
      }
      return value;
    }

    function errorHandler(error) {
      console.log(JSON.stringify({
        error: error
      }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function(error) {
          return error.properties.explanation;
        }).join("\n");
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }

    //Load the docx file as a binary
    var content = fs
      .readFileSync(path.resolve(__dirname, "..", "doc", "doc.docx"), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
      doc = new Docxtemplater(zip);
    } catch (error) {
      // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
      errorHandler(error);
    }

    //set the templateVariables
    doc.setData(set_data);

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
    } catch (error) {
      // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
      errorHandler(error);
    }

    var buf = doc.getZip()
      .generate({
        type: 'nodebuffer'
      });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname, "..", "doc", name_doc), buf);
  },

  signature(name_doc, set_data) {
    var ImageModule = require("open-docxtemplater-image-module");
    var content = fs
      .readFileSync(path.resolve(__dirname, "..", "doc", name_doc), 'binary');
    var opts = {};
    opts.centered = false;
    opts.getImage = function(tagValue, tagName) {
      return fs.readFileSync(tagValue);
    };

    opts.getSize = function(img, tagValue, tagName) {
      return [150, 150];
    };

    var imageModule = new ImageModule(opts);

    var zip = new PizZip(content);
    var docx = new Docxtemplater()
      .attachModule(imageModule)
      .loadZip(zip)
      .setData(set_data)
      .render();

    var buffer = docx
      .getZip()
      .generate({
        type: "nodebuffer",
        compression: "DEFLATE"
      });

    fs.writeFileSync(path.resolve(__dirname, "..", "doc", "sertijab", name_doc), buffer);
  }
}
