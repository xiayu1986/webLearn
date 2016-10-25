/**
 * Created by Administrator on 2016/10/23.
 * MIME类型支持
 */
var types = {

    "css": "text/css",

    "gif": "image/gif",

    "html": "text/html",

    "ico": "image/x-icon",

    "jpeg": "image/jpeg",

    "jpg": "image/jpeg",

    "js": "text/javascript",

    "json": "application/json",

    "pdf": "application/pdf",

    "png": "image/png",

    "svg": "image/svg+xml",

    "swf": "application/x-shockwave-flash",

    "tiff": "image/tiff",

    "txt": "text/plain",

    "wav": "audio/x-wav",

    "wma": "audio/x-ms-wma",

    "wmv": "video/x-ms-wmv",

    "xml": "text/xml"

};

module.exports = function (ext) {
    return types[ext] || 'text/plain'
}