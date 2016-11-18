import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "*": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "body": {
        "font": "12px/14px \"微软雅黑\"",
        "color": "#000"
    },
    "a": {
        "textDecoration": "none",
        "color": "#000"
    },
    "img": {
        "border": "none"
    },
    "li": {
        "listStyle": "none"
    },
    "input::-ms-clear": {
        "display": "none"
    },
    "WEB_format_container": {
        "overflow": "hidden",
        "position": "relative",
        "border": "#4a84c4 1px solid"
    },
    "WEB_format_tree": {
        "height": 400,
        "overflow": "auto",
        "width": "30%",
        "float": "left",
        "borderRight": "1px solid #4a84c4"
    },
    "WEB_format_source": {
        "float": "right",
        "width": "68%",
        "height": 400
    },
    "WEB_format_data": {
        "width": "96%",
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5,
        "height": "70%",
        "border": "1px solid #cccccc",
        "borderRadius": 3
    },
    "WEB_format_source textarea": {
        "width": "100%",
        "height": "100%",
        "border": "none",
        "resize": "none"
    },
    "WEB_format_option": {
        "overflow": "hidden",
        "paddingTop": 10,
        "paddingRight": 0,
        "paddingBottom": 10,
        "paddingLeft": 0
    },
    "WEB_format_option actionBtn": {
        "float": "left",
        "paddingTop": 5,
        "paddingRight": 10,
        "paddingBottom": 5,
        "paddingLeft": 10,
        "marginRight": 10,
        "border": "1px solid #4a84c4",
        "cursor": "pointer"
    },
    "WEB_format_message": {
        "width": "96%",
        "border": "#4a84c4 1px solid",
        "marginTop": 10,
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5,
        "textAlign": "center",
        "color": "#ff0000",
        "minHeight": 24
    },
    "tree-icon": {
        "display": "inline-block",
        "width": 16,
        "height": 16,
        "verticalAlign": "middle"
    },
    "tree-icon-array": {
        "background": "url(\"array.gif\")"
    },
    "tree-icon-object": {
        "background": "url(\"object.gif\")"
    },
    "tree-icon-line": {
        "background": "url(\"line.gif\")"
    },
    "tree-icon-end": {
        "background": "url(\"end.gif\")"
    },
    "tree-icon-root": {
        "background": "url(\"root.gif\")"
    },
    "tree-icon-join": {
        "background": "url(\"join.gif\")"
    },
    "tree-icon-close": {
        "background": "url(\"close.gif\")"
    },
    "tree-icon-open": {
        "background": "url(\"open.gif\")"
    },
    "tree-icon-number": {
        "background": "url(\"leaf-green.gif\")"
    },
    "tree-icon-default": {
        "background": "url(\"leaf-blue.gif\")"
    },
    "dl": {
        "marginBottom": 0
    }
});