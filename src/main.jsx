/** @jsx React.DOM */
"use strict";
var React = require("react");

/** react code below **/

var Main = React.createClass({
    render: function() {
        return (
            <div className="main">
                <h1>React Gulp Template</h1>
                <p>This is a dummy app to display the power of gulp</p>
                <p>The files in <code>./build/js/src/</code> are the compiled jsx files</p>
                <p>Built less is stored in <code>./build/css</code></p>
                <p>Ideally, to deploy an app using this template you would simply copy the index.html file and the build folder to the server</p>
            </div>
        );
    }
});

React.render(<Main />, document.querySelector("#root"));
