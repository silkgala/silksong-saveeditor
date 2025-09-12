/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/aes-js/index.js":
/*!**************************************!*\
  !*** ./node_modules/aes-js/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
(function(root) {
    "use strict";

    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    function createArray(length) {
        return new Uint8Array(length);
    }

    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
            if (sourceArray.slice) {
                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
            } else {
                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
            }
        }
        targetArray.set(sourceArray, targetStart);
    }



    var convertUtf8 = (function() {
        function toBytes(text) {
            var result = [], i = 0;
            text = encodeURI(text);
            while (i < text.length) {
                var c = text.charCodeAt(i++);

                // if it is a % sign, encode the following 2 bytes as a hex value
                if (c === 37) {
                    result.push(parseInt(text.substr(i, 2), 16))
                    i += 2;

                // otherwise, just the actual byte
                } else {
                    result.push(c)
                }
            }

            return coerceArray(result);
        }

        function fromBytes(bytes) {
            var result = [], i = 0;

            while (i < bytes.length) {
                var c = bytes[i];

                if (c < 128) {
                    result.push(String.fromCharCode(c));
                    i++;
                } else if (c > 191 && c < 224) {
                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
                    i += 2;
                } else {
                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
                    i += 3;
                }
            }

            return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();

    var convertHex = (function() {
        function toBytes(text) {
            var result = [];
            for (var i = 0; i < text.length; i += 2) {
                result.push(parseInt(text.substr(i, 2), 16));
            }

            return result;
        }

        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
        var Hex = '0123456789abcdef';

        function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
                }
                return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();


    // Number of rounds by keysize
    var numberOfRounds = {16: 10, 24: 12, 32: 14}

    // Round constant words
    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    // S-box and Inverse S-box (S is for Substitution)
    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    // Transformations for encryption
    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    // Transformations for decryption
    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    // Transformations for decryption key expansion
    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
            result.push(
                (bytes[i    ] << 24) |
                (bytes[i + 1] << 16) |
                (bytes[i + 2] <<  8) |
                 bytes[i + 3]
            );
        }
        return result;
    }

    var AES = function(key) {
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }

        Object.defineProperty(this, 'key', {
            value: coerceArray(key, true)
        });

        this._prepare();
    }


    AES.prototype._prepare = function() {

        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
        }

        // encryption round keys
        this._Ke = [];

        // decryption round keys
        this._Kd = [];

        for (var i = 0; i <= rounds; i++) {
            this._Ke.push([0, 0, 0, 0]);
            this._Kd.push([0, 0, 0, 0]);
        }

        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;

        // convert the key into ints
        var tk = convertToInt32(this.key);

        // copy values into round key arrays
        var index;
        for (var i = 0; i < KC; i++) {
            index = i >> 2;
            this._Ke[index][i % 4] = tk[i];
            this._Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                      (S[(tt >>  8) & 0xFF] << 16) ^
                      (S[ tt        & 0xFF] <<  8) ^
                       S[(tt >> 24) & 0xFF]        ^
                      (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (var i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

            // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (var i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
                              (S[(tt >>  8) & 0xFF] <<  8) ^
                              (S[(tt >> 16) & 0xFF] << 16) ^
                              (S[(tt >> 24) & 0xFF] << 24));

                for (var i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            var i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this._Ke[r][c] = tk[i];
                this._Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (var r = 1; r < rounds; r++) {
            for (var c = 0; c < 4; c++) {
                tt = this._Kd[r][c];
                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
                                  U2[(tt >> 16) & 0xFF] ^
                                  U3[(tt >>  8) & 0xFF] ^
                                  U4[ tt        & 0xFF]);
            }
        }
    }

    AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Ke[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T4[ t[(i + 3) % 4]        & 0xff] ^
                        this._Ke[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Ke[rounds][i];
            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }

    AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Kd[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T8[ t[(i + 1) % 4]        & 0xff] ^
                        this._Kd[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Kd[rounds][i];
            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }


    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);
            block = this._aes.encrypt(block);
            copyArray(block, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);
            copyArray(block, plaintext, i);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Block Chaining";
        this.name = "cbc";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastCipherblock = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (var j = 0; j < 16; j++) {
                block[j] ^= this._lastCipherblock[j];
            }

            this._lastCipherblock = this._aes.encrypt(block);
            copyArray(this._lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);

            for (var j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
            }

            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Feedback";
        this.name = "cfb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 size)');
        }

        if (!segmentSize) { segmentSize = 1; }

        this.segmentSize = segmentSize;

        this._shiftRegister = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if ((plaintext.length % this.segmentSize) != 0) {
            throw new Error('invalid plaintext size (must be segmentSize bytes)');
        }

        var encrypted = coerceArray(plaintext, true);

        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return encrypted;
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if ((ciphertext.length % this.segmentSize) != 0) {
            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
        }

        var plaintext = coerceArray(ciphertext, true);

        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return plaintext;
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Output Feedback";
        this.name = "ofb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
            throw Error('Counter must be instanitated with `new`');
        }

        // We allow 0, but anything false-ish uses the default 1
        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = createArray(16);
            this.setValue(initialValue);

        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number' || parseInt(value) != value) {
            throw new Error('invalid counter value (must be an integer)');
        }

        // We cannot safely handle numbers beyond the safe range for integers
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('integer value out of safe range');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = parseInt(value / 256);
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this._counter = bytes;
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            if (this._counter[i] === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i]++;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Counter";
        this.name = "ctr";

        if (!(counter instanceof Counter)) {
            counter = new Counter(counter)
        }

        this._counter = counter;

        this._remainingCounter = null;
        this._remainingCounterIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._remainingCounterIndex === 16) {
                this._remainingCounter = this._aes.encrypt(this._counter._counter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    ///////////////////////
    // Padding

    // See:https://tools.ietf.org/html/rfc2315
    function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - (data.length % 16);
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
            result[i] = padder;
        }
        return result;
    }

    function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

        var padder = data[data.length - 1];
        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
            if (data[length + i] !== padder) {
                throw new Error('PKCS#7 invalid padding byte');
            }
        }

        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
    }

    ///////////////////////
    // Exporting


    // The block cipher
    var aesjs = {
        AES: AES,
        Counter: Counter,

        ModeOfOperation: {
            ecb: ModeOfOperationECB,
            cbc: ModeOfOperationCBC,
            cfb: ModeOfOperationCFB,
            ofb: ModeOfOperationOFB,
            ctr: ModeOfOperationCTR
        },

        utils: {
            hex: convertHex,
            utf8: convertUtf8
        },

        padding: {
            pkcs7: {
                pad: pkcs7pad,
                strip: pkcs7strip
            }
        },

        _arrayTest: {
            coerceArray: coerceArray,
            createArray: createArray,
            copyArray: copyArray,
        }
    };


    // node.js
    if (true) {
        module.exports = aesjs

    // RequireJS/AMD
    // http://www.requirejs.org/docs/api.html
    // https://github.com/amdjs/amdjs-api/wiki/AMD
    } else {}


})(this);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ":root {\n  --background-color: #1a1a1a;\n  --surface-color: #2c2c2c;\n  --primary-color: #e43434;\n  --primary-hover-color: #ff4848;\n  --text-color: #f0f0f0;\n  --text-muted-color: #888;\n  --border-color: #444;\n  --font-family: 'Inter', sans-serif;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody, html {\n  margin: 0; \n  padding: 0;\n  font-family: var(--font-family);\n  font-size: 16px; \n  background-color: var(--background-color);\n  color: var(--text-color);\n}\n\nbody {\n  display: grid; \n  justify-content: center;\n  padding: 20px;\n}\n\n#wrapper {\n  width: 100%;\n  max-width: 800px; \n  margin-top: 40px;\n  display: grid; \n  gap: 25px;\n}\n\nh1 {\n  color: var(--primary-color);\n  text-align: center;\n  margin: 0;\n}\n\nh2 {\n  color: var(--primary-color);\n  margin-top: 0;\n  border-bottom: 1px solid var(--border-color);\n  padding-bottom: 10px;\n}\n\n/* --- Instructions & Table --- */\n.instructions {\n  background-color: var(--surface-color);\n  padding: 20px;\n  border-radius: 8px;\n  border: 1px solid var(--border-color);\n}\n\n.save-locations-table {\n  width: 100%;\n  border-collapse: collapse;\n  margin: 15px 0;\n}\n\n.save-locations-table th, .save-locations-table td {\n  padding: 10px;\n  text-align: left;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.save-locations-table th {\n  color: var(--text-muted-color);\n  font-weight: 500;\n}\n\n.save-locations-table td code {\n  background-color: #111;\n  padding: 2px 5px;\n  border-radius: 4px;\n}\n\n.notes {\n  font-size: 0.9em;\n  color: var(--text-muted-color);\n  margin: 5px 0;\n}\n\n.warning {\n  text-align: center;\n  font-weight: bold;\n  color: #ffc107;\n  padding: 10px;\n  border: 1px solid #ffc107;\n  border-radius: 5px;\n  background-color: rgba(255, 193, 7, 0.1);\n}\n\n/* --- Drop Zone & Buttons --- */\n.drop-zone {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px;\n  border: 2px dashed var(--border-color);\n  border-radius: 8px;\n  background-color: var(--surface-color);\n  text-align: center;\n  transition: background-color 0.2s, border-color 0.2s;\n  cursor: pointer;\n}\n\n.drop-zone.dragging {\n  border-color: var(--primary-color);\n  background-color: #333;\n}\n\n.drop-zone p {\n  color: var(--text-muted-color);\n  margin: 0 0 15px 0;\n  pointer-events: none;\n}\n\n.error-message {\n  color: var(--primary-color);\n  font-weight: bold;\n  margin-top: 15px;\n}\n\nbutton {\n  font-family: inherit; \n  font-size: inherit; \n  padding: 10px 20px;\n  border-radius: 5px;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.2s;\n  font-weight: 500;\n}\n\n.btn-secondary {\n  background-color: #4f4f4f;\n  color: var(--text-color);\n  border: 1px solid var(--border-color);\n}\n.btn-secondary:hover {\n  background-color: #5a5a5a;\n}\n\n.btn-primary {\n  background-color: var(--primary-color);\n  color: white;\n}\n.btn-primary:hover {\n  background-color: var(--primary-hover-color);\n}\n\nbutton:disabled {\n  background-color: #3e3e3e;\n  color: #777;\n  cursor: not-allowed;\n}\n\n#file-input {\n  display: none;\n}\n\n.save-buttons {\n  display: flex;\n  justify-content: center;\n  gap: 20px;\n}\n\nhr {\n  border: none;\n  border-top: 1px solid var(--border-color);\n  margin: 10px 0;\n}\n\n/* --- Editor Form --- */\n.editor-section {\n  background-color: var(--surface-color);\n  padding: 20px;\n  border-radius: 8px;\n  border: 1px solid var(--border-color);\n}\n\n.form-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 20px;\n}\n\n.form-group {\n  display: flex;\n  flex-direction: column;\n}\n\n.form-group label {\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n\n.form-group .note {\n  font-size: 0.8em;\n  color: var(--text-muted-color);\n  margin-top: 5px;\n}\n\ninput[type=\"number\"] {\n  background-color: #111;\n  border: 1px solid var(--border-color);\n  color: var(--text-color);\n  padding: 8px;\n  border-radius: 4px;\n  font-family: inherit;\n  font-size: 1em;\n}\n\n.checkbox-group {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n}\n\ninput[type=\"checkbox\"] {\n    width: 1.3em;\n    height: 1.3em;\n    accent-color: var(--primary-color);\n}\n", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-dom/cjs/react-dom.development.js":
/*!*************************************************************!*\
  !*** ./node_modules/react-dom/cjs/react-dom.development.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 true &&
  (function () {
    function noop() {}
    function testStringCoercion(value) {
      return "" + value;
    }
    function createPortal$1(children, containerInfo, implementation) {
      var key =
        3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      try {
        testStringCoercion(key);
        var JSCompiler_inline_result = !1;
      } catch (e) {
        JSCompiler_inline_result = !0;
      }
      JSCompiler_inline_result &&
        (console.error(
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          ("function" === typeof Symbol &&
            Symbol.toStringTag &&
            key[Symbol.toStringTag]) ||
            key.constructor.name ||
            "Object"
        ),
        testStringCoercion(key));
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children: children,
        containerInfo: containerInfo,
        implementation: implementation
      };
    }
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    function getValueDescriptorExpectingObjectForWarning(thing) {
      return null === thing
        ? "`null`"
        : void 0 === thing
          ? "`undefined`"
          : "" === thing
            ? "an empty string"
            : 'something with type "' + typeof thing + '"';
    }
    function getValueDescriptorExpectingEnumForWarning(thing) {
      return null === thing
        ? "`null`"
        : void 0 === thing
          ? "`undefined`"
          : "" === thing
            ? "an empty string"
            : "string" === typeof thing
              ? JSON.stringify(thing)
              : "number" === typeof thing
                ? "`" + thing + "`"
                : 'something with type "' + typeof thing + '"';
    }
    function resolveDispatcher() {
      var dispatcher = ReactSharedInternals.H;
      null === dispatcher &&
        console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      return dispatcher;
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __webpack_require__(/*! react */ "./node_modules/react/index.js"),
      Internals = {
        d: {
          f: noop,
          r: function () {
            throw Error(
              "Invalid form element. requestFormReset must be passed a form that was rendered by React."
            );
          },
          D: noop,
          C: noop,
          L: noop,
          m: noop,
          X: noop,
          S: noop,
          M: noop
        },
        p: 0,
        findDOMNode: null
      },
      REACT_PORTAL_TYPE = Symbol.for("react.portal"),
      ReactSharedInternals =
        React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    ("function" === typeof Map &&
      null != Map.prototype &&
      "function" === typeof Map.prototype.forEach &&
      "function" === typeof Set &&
      null != Set.prototype &&
      "function" === typeof Set.prototype.clear &&
      "function" === typeof Set.prototype.forEach) ||
      console.error(
        "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
      );
    exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
      Internals;
    exports.createPortal = function (children, container) {
      var key =
        2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (
        !container ||
        (1 !== container.nodeType &&
          9 !== container.nodeType &&
          11 !== container.nodeType)
      )
        throw Error("Target container is not a DOM element.");
      return createPortal$1(children, container, null, key);
    };
    exports.flushSync = function (fn) {
      var previousTransition = ReactSharedInternals.T,
        previousUpdatePriority = Internals.p;
      try {
        if (((ReactSharedInternals.T = null), (Internals.p = 2), fn))
          return fn();
      } finally {
        (ReactSharedInternals.T = previousTransition),
          (Internals.p = previousUpdatePriority),
          Internals.d.f() &&
            console.error(
              "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
            );
      }
    };
    exports.preconnect = function (href, options) {
      "string" === typeof href && href
        ? null != options && "object" !== typeof options
          ? console.error(
              "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
              getValueDescriptorExpectingEnumForWarning(options)
            )
          : null != options &&
            "string" !== typeof options.crossOrigin &&
            console.error(
              "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
              getValueDescriptorExpectingObjectForWarning(options.crossOrigin)
            )
        : console.error(
            "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
      "string" === typeof href &&
        (options
          ? ((options = options.crossOrigin),
            (options =
              "string" === typeof options
                ? "use-credentials" === options
                  ? options
                  : ""
                : void 0))
          : (options = null),
        Internals.d.C(href, options));
    };
    exports.prefetchDNS = function (href) {
      if ("string" !== typeof href || !href)
        console.error(
          "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          getValueDescriptorExpectingObjectForWarning(href)
        );
      else if (1 < arguments.length) {
        var options = arguments[1];
        "object" === typeof options && options.hasOwnProperty("crossOrigin")
          ? console.error(
              "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
              getValueDescriptorExpectingEnumForWarning(options)
            )
          : console.error(
              "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
              getValueDescriptorExpectingEnumForWarning(options)
            );
      }
      "string" === typeof href && Internals.d.D(href);
    };
    exports.preinit = function (href, options) {
      "string" === typeof href && href
        ? null == options || "object" !== typeof options
          ? console.error(
              "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
              getValueDescriptorExpectingEnumForWarning(options)
            )
          : "style" !== options.as &&
            "script" !== options.as &&
            console.error(
              'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
              getValueDescriptorExpectingEnumForWarning(options.as)
            )
        : console.error(
            "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
      if (
        "string" === typeof href &&
        options &&
        "string" === typeof options.as
      ) {
        var as = options.as,
          crossOrigin = getCrossOriginStringAs(as, options.crossOrigin),
          integrity =
            "string" === typeof options.integrity ? options.integrity : void 0,
          fetchPriority =
            "string" === typeof options.fetchPriority
              ? options.fetchPriority
              : void 0;
        "style" === as
          ? Internals.d.S(
              href,
              "string" === typeof options.precedence
                ? options.precedence
                : void 0,
              {
                crossOrigin: crossOrigin,
                integrity: integrity,
                fetchPriority: fetchPriority
              }
            )
          : "script" === as &&
            Internals.d.X(href, {
              crossOrigin: crossOrigin,
              integrity: integrity,
              fetchPriority: fetchPriority,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
      }
    };
    exports.preinitModule = function (href, options) {
      var encountered = "";
      ("string" === typeof href && href) ||
        (encountered +=
          " The `href` argument encountered was " +
          getValueDescriptorExpectingObjectForWarning(href) +
          ".");
      void 0 !== options && "object" !== typeof options
        ? (encountered +=
            " The `options` argument encountered was " +
            getValueDescriptorExpectingObjectForWarning(options) +
            ".")
        : options &&
          "as" in options &&
          "script" !== options.as &&
          (encountered +=
            " The `as` option encountered was " +
            getValueDescriptorExpectingEnumForWarning(options.as) +
            ".");
      if (encountered)
        console.error(
          "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
          encountered
        );
      else
        switch (
          ((encountered =
            options && "string" === typeof options.as ? options.as : "script"),
          encountered)
        ) {
          case "script":
            break;
          default:
            (encountered =
              getValueDescriptorExpectingEnumForWarning(encountered)),
              console.error(
                'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
                encountered,
                href
              );
        }
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as)
            (encountered = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            )),
              Internals.d.M(href, {
                crossOrigin: encountered,
                integrity:
                  "string" === typeof options.integrity
                    ? options.integrity
                    : void 0,
                nonce:
                  "string" === typeof options.nonce ? options.nonce : void 0
              });
        } else null == options && Internals.d.M(href);
    };
    exports.preload = function (href, options) {
      var encountered = "";
      ("string" === typeof href && href) ||
        (encountered +=
          " The `href` argument encountered was " +
          getValueDescriptorExpectingObjectForWarning(href) +
          ".");
      null == options || "object" !== typeof options
        ? (encountered +=
            " The `options` argument encountered was " +
            getValueDescriptorExpectingObjectForWarning(options) +
            ".")
        : ("string" === typeof options.as && options.as) ||
          (encountered +=
            " The `as` option encountered was " +
            getValueDescriptorExpectingObjectForWarning(options.as) +
            ".");
      encountered &&
        console.error(
          'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
          encountered
        );
      if (
        "string" === typeof href &&
        "object" === typeof options &&
        null !== options &&
        "string" === typeof options.as
      ) {
        encountered = options.as;
        var crossOrigin = getCrossOriginStringAs(
          encountered,
          options.crossOrigin
        );
        Internals.d.L(href, encountered, {
          crossOrigin: crossOrigin,
          integrity:
            "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority:
            "string" === typeof options.fetchPriority
              ? options.fetchPriority
              : void 0,
          referrerPolicy:
            "string" === typeof options.referrerPolicy
              ? options.referrerPolicy
              : void 0,
          imageSrcSet:
            "string" === typeof options.imageSrcSet
              ? options.imageSrcSet
              : void 0,
          imageSizes:
            "string" === typeof options.imageSizes
              ? options.imageSizes
              : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    exports.preloadModule = function (href, options) {
      var encountered = "";
      ("string" === typeof href && href) ||
        (encountered +=
          " The `href` argument encountered was " +
          getValueDescriptorExpectingObjectForWarning(href) +
          ".");
      void 0 !== options && "object" !== typeof options
        ? (encountered +=
            " The `options` argument encountered was " +
            getValueDescriptorExpectingObjectForWarning(options) +
            ".")
        : options &&
          "as" in options &&
          "string" !== typeof options.as &&
          (encountered +=
            " The `as` option encountered was " +
            getValueDescriptorExpectingObjectForWarning(options.as) +
            ".");
      encountered &&
        console.error(
          'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
          encountered
        );
      "string" === typeof href &&
        (options
          ? ((encountered = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            )),
            Internals.d.m(href, {
              as:
                "string" === typeof options.as && "script" !== options.as
                  ? options.as
                  : void 0,
              crossOrigin: encountered,
              integrity:
                "string" === typeof options.integrity
                  ? options.integrity
                  : void 0
            }))
          : Internals.d.m(href));
    };
    exports.requestFormReset = function (form) {
      Internals.d.r(form);
    };
    exports.unstable_batchedUpdates = function (fn, a) {
      return fn(a);
    };
    exports.useFormState = function (action, initialState, permalink) {
      return resolveDispatcher().useFormState(action, initialState, permalink);
    };
    exports.useFormStatus = function () {
      return resolveDispatcher().useHostTransitionStatus();
    };
    exports.version = "19.1.1";
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();


/***/ }),

/***/ "./node_modules/react-dom/index.js":
/*!*****************************************!*\
  !*** ./node_modules/react-dom/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (true) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-dom.development.js */ "./node_modules/react-dom/cjs/react-dom.development.js");
}


/***/ }),

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.14.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var ReactVersion = '16.14.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  suspense: null
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
function describeComponentFrame (name, source, ownerName) {
  var sourceInfo = '';

  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, '');

    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        var match = path.match(BEFORE_SLASH_RE);

        if (match) {
          var pathBeforeSlash = match[1];

          if (pathBeforeSlash) {
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }

    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }

  return '\n    in ' + (name || 'Unknown') + sourceInfo;
}

var Resolved = 1;
function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return "Profiler";

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';

      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        return getComponentName(type.type);

      case REACT_BLOCK_TYPE:
        return getComponentName(type.render);

      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);

          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }

          break;
        }
    }
  }

  return null;
}

var ReactDebugCurrentFrame = {};
var currentlyValidatingElement = null;
function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = ''; // Add an extra top frame while an element is being validated

    if (currentlyValidatingElement) {
      var name = getComponentName(currentlyValidatingElement.type);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    } // Delegate to the injected renderer-specific implementation


    var impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

/**
 * Used by act() to track whether you're inside an act() scope.
 */
var IsSomeRendererActing = {
  current: false
};

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner,
  IsSomeRendererActing: IsSomeRendererActing,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    printWarning('warn', format, args);
  }
}
function error(format) {
  {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    printWarning('error', format, args);
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var hasExistingStack = args.length > 0 && typeof args[args.length - 1] === 'string' && args[args.length - 1].indexOf('\n    in') === 0;

    if (!hasExistingStack) {
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      }
    }

    var argsWithFormat = args.map(function (item) {
      return '' + item;
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      throw new Error(message);
    } catch (x) {}
  }
}

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + "." + callerName;

    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }

    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}
/**
 * This is the abstract API for an update queue.
 */


var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};

{
  Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */


function Component(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };

  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

        return undefined;
      }
    });
  };

  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

_assign(pureComponentPrototype, Component.prototype);

pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };

  {
    Object.seal(refObject);
  }

  return refObject;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    }
  };

  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
      var componentName = getComponentName(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://fb.me/react-strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */

function cloneElement(element, config, children) {
  if (!!(element === null || element === undefined)) {
    {
      throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
    }
  }

  var propName; // Original props are copied

  var props = _assign({}, element.props); // Reserved names are extracted


  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */


var didWarnAboutMaps = false;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];

function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;

  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}
/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */


function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;

      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }

    }
  }

  if (invokeCallback) {
    callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);

    if (typeof iteratorFn === 'function') {

      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          if (!didWarnAboutMaps) {
            warn('Using Maps as children is deprecated and will be removed in ' + 'a future major release. Consider converting children to ' + 'an array of keyed ReactElements instead.');
          }

          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;

      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';

      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }

      var childrenString = '' + children;

      {
        {
          throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ")." + addendum );
        }
      }
    }
  }

  return subtreeCount;
}
/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */


function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}
/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */


function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;
  func.call(context, child, bookKeeping.count++);
}
/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */


function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;
  var mappedChild = func.call(context, child, bookKeeping.count++);

  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }

    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';

  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }

  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */


function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


function countChildren(children) {
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */


function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  if (!isValidElement(children)) {
    {
      throw Error( "React.Children.only expected to receive a single React element child." );
    }
  }

  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
        error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
      }
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      }
    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function lazy(ctor) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };

  {
    // In production, this would just set it on the object.
    var defaultProps;
    var propTypes;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          defaultProps = newDefaultProps; // Match production behavior more closely:

          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          propTypes = newPropTypes; // Match production behavior more closely:

          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      if (render.length !== 0 && render.length !== 2) {
        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
      }
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }

  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;

  if (!(dispatcher !== null)) {
    {
      throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem." );
    }
  }

  return dispatcher;
}

function useContext(Context, unstable_observedBits) {
  var dispatcher = resolveDispatcher();

  {
    if (unstable_observedBits !== undefined) {
      error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '');
    } // TODO: add a more generic warning for invalid values.


    if (Context._context !== undefined) {
      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.

      if (realContext.Consumer === Context) {
        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }

  return dispatcher.useContext(Context, unstable_observedBits);
}
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
function useEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function useLayoutEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
function useCallback(callback, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
function useMemo(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
function useImperativeHandle(ref, create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);

    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }

  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }

  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }

  return '';
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

    if (parentName) {
      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
    }
  }

  return info;
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }

  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.

  var childOwner = '';

  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
  }

  setCurrentlyValidatingElement(element);

  {
    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }

  setCurrentlyValidatingElement(null);
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];

      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);

    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;

        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var name = getComponentName(type);
    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    setCurrentlyValidatingElement(fragment);
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        break;
      }
    }

    if (fragment.ref !== null) {
      error('Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }
}
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  if (!validType) {
    var info = '';

    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString;

    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    {
      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }
  }

  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.

  if (element == null) {
    return element;
  } // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)


  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
var didWarnAboutDeprecatedCreateFactory = false;
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;

  {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;

      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
    } // Legacy hook: remove it


    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);

  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }

  validatePropTypes(newElement);
  return newElement;
}

{

  try {
    var frozenObject = Object.freeze({});
    var testMap = new Map([[frozenObject, null]]);
    var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
    // https://github.com/rollup/rollup/issues/1771
    // TODO: we can remove these if Rollup fixes the bug.

    testMap.set(0, 0);
    testSet.add(0);
  } catch (e) {
  }
}

var createElement$1 =  createElementWithValidation ;
var cloneElement$1 =  cloneElementWithValidation ;
var createFactory =  createFactoryWithValidation ;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray: toArray,
  only: onlyChild
};

exports.Children = Children;
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createFactory = createFactory;
exports.createRef = createRef;
exports.forwardRef = forwardRef;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useEffect = useEffect;
exports.useImperativeHandle = useImperativeHandle;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.version = ReactVersion;
  })();
}


/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "./node_modules/react/cjs/react.development.js");
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/base64.js":
/*!***********************!*\
  !*** ./src/base64.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encode = encode;
exports.decode = decode;
var BASE64_ARRAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").map(function (c) {
    return c.charCodeAt(0);
});
var BASE64_ENCODE_TABLE = new Map(BASE64_ARRAY.map(function (ord, i) {
    return [i, ord];
}));
var BASE64_DECODE_TABLE = new Map(BASE64_ARRAY.map(function (ord, i) {
    return [ord, i];
}));

function encode(buffer) {
    buffer = new Uint8Array(buffer).slice();
    var output = new Uint8Array(Math.ceil(Math.ceil(buffer.length * 4 / 3) / 4) * 4);
    var continuous = Math.floor(buffer.length / 3) * 3;

    for (var i = 0; i < continuous; i += 3) {
        var k = 4 * i / 3;
        output[k] = BASE64_ENCODE_TABLE.get(buffer[i] >> 2);
        output[k + 1] = BASE64_ENCODE_TABLE.get((buffer[i] & 0x03) << 4 | buffer[i + 1] >> 4);
        output[k + 2] = BASE64_ENCODE_TABLE.get((buffer[i + 1] & 0x0F) << 2 | buffer[i + 2] >> 6);
        output[k + 3] = BASE64_ENCODE_TABLE.get(buffer[i + 2] & 0x3F);
    }

    if (buffer[continuous] != undefined) {
        var _k = 4 * continuous / 3;
        output[_k] = BASE64_ENCODE_TABLE.get(buffer[continuous] >> 2);
        if (buffer[continuous + 1] == undefined) {
            output[_k + 1] = BASE64_ENCODE_TABLE.get((buffer[continuous] & 0x03) << 4);
            output[_k + 2] = BASE64_ENCODE_TABLE.get(64);
        } else {
            output[_k + 1] = BASE64_ENCODE_TABLE.get((buffer[continuous] & 0x03) << 4 | buffer[continuous + 1] >> 4);
            output[_k + 2] = BASE64_ENCODE_TABLE.get((buffer[continuous + 1] & 0x0F) << 2);
        }
        output[_k + 3] = BASE64_ENCODE_TABLE.get(64);
    }

    return output;
}

function decode(buffer) {
    buffer = new Uint8Array(buffer).slice();
    buffer = buffer.map(function (v) {
        return BASE64_DECODE_TABLE.get(v);
    });
    {
        var p = buffer.indexOf(64);buffer = buffer.subarray(0, p != -1 ? p : buffer.length);
    }
    var output = new Uint8Array(3 * buffer.length / 4);
    var continuous = Math.floor(buffer.length / 4) * 4;
    for (var i = 0; i < continuous; i += 4) {
        var k = 3 * i / 4;
        output[k] = buffer[i] << 2 | buffer[i + 1] >> 4;
        output[k + 1] = (buffer[i + 1] & 0x0F) << 4 | buffer[i + 2] >> 2;
        output[k + 2] = (buffer[i + 2] & 0x03) << 6 | buffer[i + 3];
    }
    if (buffer[continuous] != undefined) {
        var _k2 = 3 * continuous / 4;
        output[_k2] = buffer[continuous] << 2 | buffer[continuous + 1] >> 4;
        if (buffer[continuous + 2] != undefined) {
            output[_k2 + 1] = (buffer[continuous + 1] & 0x0F) << 4 | buffer[continuous + 2] >> 2;
        }
    }
    return output;
}

/***/ }),

/***/ "./src/functions.js":
/*!**************************!*\
  !*** ./src/functions.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StringToBytes = StringToBytes;
exports.BytesToString = BytesToString;
exports.AESDecrypt = AESDecrypt;
exports.AESEncrypt = AESEncrypt;
exports.GenerateLengthPrefixedString = GenerateLengthPrefixedString;
exports.AddHeader = AddHeader;
exports.RemoveHeader = RemoveHeader;
exports.Decode = Decode;
exports.Encode = Encode;
exports.Hash = Hash;
exports.HumanTime = HumanTime;
exports.DownloadData = DownloadData;

var _aesJs = __webpack_require__(/*! aes-js */ "./node_modules/aes-js/index.js");

var _base = __webpack_require__(/*! ./base64.js */ "./src/base64.js");

var base64 = _interopRequireWildcard(_base);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var cSharpHeader = [0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0];
var aesKey = StringToBytes('UKu52ePUBwetZ9wNX88o54dnfKRu0T1l');
var ecb = new _aesJs.ModeOfOperation.ecb(aesKey);

String.prototype.reverse = function () {
    return this.split("").reverse().join("");
};

function StringToBytes(string) {
    return new TextEncoder().encode(string);
}

function BytesToString(bytes) {
    return new TextDecoder().decode(bytes);
}

// aes decrypts and removes pkcs7 padding 
function AESDecrypt(bytes) {
    var data = ecb.decrypt(bytes);
    data = data.subarray(0, -data[data.length - 1]);
    return data;
}

// pkcs7 pads and encrypts 
function AESEncrypt(bytes) {
    var padValue = 16 - bytes.length % 16;
    var padded = new Uint8Array(bytes.length + padValue);
    padded.fill(padValue);
    padded.set(bytes);
    return ecb.encrypt(padded);
}

// LengthPrefixedString https://msdn.microsoft.com/en-us/library/cc236844.aspx
function GenerateLengthPrefixedString(length) {
    var length = Math.min(0x7FFFFFFF, length); // maximum value
    var bytes = [];
    for (var i = 0; i < 4; i++) {
        if (length >> 7 != 0) {
            bytes.push(length & 0x7F | 0x80);
            length >>= 7;
        } else {
            bytes.push(length & 0x7F);
            length >>= 7;
            break;
        }
    }
    if (length != 0) {
        bytes.push(length);
    }

    return bytes;
}

function AddHeader(bytes) {
    var lengthData = GenerateLengthPrefixedString(bytes.length);
    var newBytes = new Uint8Array(bytes.length + cSharpHeader.length + lengthData.length + 1);
    newBytes.set(cSharpHeader); // fixed header 
    newBytes.subarray(cSharpHeader.length).set(lengthData); // variable LengthPrefixedString header 
    newBytes.subarray(cSharpHeader.length + lengthData.length).set(bytes); // our data 
    newBytes.subarray(cSharpHeader.length + lengthData.length + bytes.length).set([11]); // fixed header (11) 
    return newBytes;
}

function RemoveHeader(bytes) {
    // remove fixed csharp header, plus the ending byte 11. 
    bytes = bytes.subarray(cSharpHeader.length, bytes.length - 1);

    // remove LengthPrefixedString header 
    var lengthCount = 0;
    for (var i = 0; i < 5; i++) {
        lengthCount++;
        if ((bytes[i] & 0x80) == 0) {
            break;
        }
    }
    bytes = bytes.subarray(lengthCount);

    return bytes;
}

function Decode(bytes) {
    bytes = bytes.slice();
    bytes = RemoveHeader(bytes);
    bytes = base64.decode(bytes);
    bytes = AESDecrypt(bytes);
    return BytesToString(bytes);
}

function Encode(jsonString) {
    var bytes = StringToBytes(jsonString);
    bytes = AESEncrypt(bytes);
    bytes = base64.encode(bytes);
    // bytes = bytes.filter(v => v != 10 && v != 13)
    return AddHeader(bytes);
}

function Hash(string) {
    return string.split("").reduce(function (a, b) {
        return (a << 5) - a + b.charCodeAt(0);
    }, 0);
}

function round(value, precision) {
    var multi = Math.pow(10, precision);
    return Math.round(value * multi) / multi;
}

function HumanTime(date) {
    var minutes = (new Date() - date) / 1000 / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var weeks = days / 7;
    var months = weeks / 4;
    var years = months / 12;

    if (minutes < 1) {
        return "now";
    } else if (minutes < 120) {
        return 'about ' + round(minutes, 0) + ' minutes ago';
    } else if (hours < 48) {
        return 'about ' + round(hours, 0) + ' hours ago';
    } else if (days < 14) {
        return 'about ' + round(days, 0) + ' days ago';
    } else if (weeks < 8) {
        return 'about ' + round(weeks, 0) + ' weeks ago';
    } else if (months < 24) {
        return 'about ' + round(months, 1) + ' months ago';
    }

    return 'about ' + round(years, 1) + ' years ago';
}

function DownloadData(data, fileName) {
    var a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(new Blob([data], { type: "octet/stream" })));
    a.setAttribute('download', fileName);
    a.setAttribute('style', 'position: fixed; opacity: 0; left: 0; top: 0;');
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _functions = __webpack_require__(/*! ./functions.js */ "./src/functions.js");

__webpack_require__(/*! ./style.css */ "./src/style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.state = {
            saveData: null, // This will hold the parsed JSON object
            fileName: "",
            dragging: false,
            error: null

            // --- Drag and Drop Handlers ---
        };

        _this.handleDragEnter = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.setState({ dragging: true });
        };

        _this.handleDragLeave = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.setState({ dragging: false });
        };

        _this.handleDragOver = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        _this.handleDrop = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.setState({ dragging: false });
            var files = [].concat(_toConsumableArray(e.dataTransfer.files));
            _this.handleFile(files[0]);
        };

        _this.handleBrowseClick = function () {
            _this.fileInputRef.current.click();
        };

        _this.handleFileSelect = function (e) {
            var file = e.target.files[0];
            _this.handleFile(file);
            e.target.value = null; // Reset input for re-uploading the same file
        };

        _this.handleFile = function (file) {
            if (!file) return;

            // Validation: Check for .dat extension
            if (!file.name.toLowerCase().endsWith('.dat')) {
                _this.setState({ error: "Invalid file type. Please upload a .dat file." });
                return;
            }

            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function () {
                try {
                    var result = reader.result;
                    var decrypted = (0, _functions.Decode)(new Uint8Array(result));
                    var parsedData = JSON.parse(decrypted);

                    _this.setState({
                        saveData: parsedData,
                        fileName: file.name,
                        error: null
                    });
                } catch (err) {
                    console.error("Decryption failed:", err);
                    _this.setState({ error: "File decryption failed. The file may be corrupt or not a valid Silksong save." });
                }
            };
        };

        _this.handleNumericChange = function (e) {
            for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                keys[_key - 1] = arguments[_key];
            }

            var value = parseInt(e.target.value, 10) || 0;
            _this.setState(function (prevState) {
                var newState = JSON.parse(JSON.stringify(prevState)); // Deep copy
                var current = newState.saveData;
                // Traverse the keys to get to the parent object
                for (var i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                // Update the final key
                current[keys[keys.length - 1]] = value;

                // Special cases for linked values
                if (keys.includes('health')) {
                    newState.saveData.playerData.maxHealth = value;
                }
                if (keys.includes('silk')) {
                    newState.saveData.playerData.silkMax = value;
                }

                return newState;
            });
        };

        _this.handleCheckboxChange = function (e) {
            for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                keys[_key2 - 1] = arguments[_key2];
            }

            var value = e.target.checked;
            _this.setState(function (prevState) {
                var newState = JSON.parse(JSON.stringify(prevState)); // Deep copy
                var current = newState.saveData;
                for (var i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
                return newState;
            });
        };

        _this.handleSaveEncrypted = function () {
            if (!_this.state.saveData) return;
            try {
                var jsonString = JSON.stringify(_this.state.saveData);
                var encrypted = (0, _functions.Encode)(jsonString);
                (0, _functions.DownloadData)(encrypted, _this.state.fileName);
            } catch (err) {
                console.error("Encryption/Save failed:", err);
                _this.setState({ error: "Failed to save the file." });
            }
        };

        _this.handleSaveJson = function () {
            if (!_this.state.saveData) return;
            try {
                var jsonString = JSON.stringify(_this.state.saveData, null, 2);
                var newFileName = _this.state.fileName.replace('.dat', '.json');
                (0, _functions.DownloadData)(jsonString, newFileName);
            } catch (err) {
                console.error("JSON save failed:", err);
                _this.setState({ error: "Failed to save the JSON file." });
            }
        };

        _this.fileInputRef = _react2.default.createRef();
        return _this;
    }

    // --- File Handling ---


    // --- Editor Field Handlers ---
    // A generic handler for nested numeric values.


    // A generic handler for nested boolean values (checkboxes).


    // --- Save Handlers ---


    _createClass(App, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                saveData = _state.saveData,
                dragging = _state.dragging,
                error = _state.error;

            var pd = saveData ? saveData.playerData : null;

            return _react2.default.createElement(
                "div",
                { id: "wrapper" },
                _react2.default.createElement(
                    "h1",
                    null,
                    "Silksong Save Editor"
                ),
                _react2.default.createElement(
                    "div",
                    { className: "instructions" },
                    _react2.default.createElement(
                        "h2",
                        null,
                        "Save File Locations"
                    ),
                    _react2.default.createElement(
                        "table",
                        { className: "save-locations-table" },
                        _react2.default.createElement(
                            "thead",
                            null,
                            _react2.default.createElement(
                                "tr",
                                null,
                                _react2.default.createElement(
                                    "th",
                                    null,
                                    "System"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    null,
                                    "Location"
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "tbody",
                            null,
                            _react2.default.createElement(
                                "tr",
                                null,
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    "Windows"
                                ),
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    _react2.default.createElement(
                                        "code",
                                        null,
                                        "%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight Silksong\\"
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                "tr",
                                null,
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    "Microsoft Store"
                                ),
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    _react2.default.createElement(
                                        "code",
                                        null,
                                        "%LOCALAPPDATA%\\Packages\\TeamCherry.HollowKnightSilksong_y4jvztpgccj42\\SystemAppData\\wgs"
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                "tr",
                                null,
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    "macOS (OS X)"
                                ),
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    _react2.default.createElement(
                                        "code",
                                        null,
                                        "$HOME/Library/Application Support/unity.Team-Cherry.Silksong/default"
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                "tr",
                                null,
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    "Linux"
                                ),
                                _react2.default.createElement(
                                    "td",
                                    null,
                                    _react2.default.createElement(
                                        "code",
                                        null,
                                        "$XDG_CONFIG_HOME/unity3d/Team Cherry/Hollow Knight Silksong/"
                                    )
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "p",
                        { className: "notes" },
                        "For Steam, each user\u2019s save files will be in a sub-folder of their Steam user ID. For non-Steam builds, save files will be in a default sub-folder."
                    ),
                    _react2.default.createElement(
                        "p",
                        { className: "notes" },
                        _react2.default.createElement(
                            "code",
                            null,
                            "user1.dat"
                        ),
                        " for save slot 1. ",
                        _react2.default.createElement(
                            "code",
                            null,
                            "user2.dat"
                        ),
                        " for slot 2. 4 total save slots."
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "warning" },
                    "Always backup your save files (.dat) before editing!"
                ),
                _react2.default.createElement(
                    "div",
                    {
                        className: "drop-zone " + (dragging ? 'dragging' : ''),
                        onClick: this.handleBrowseClick,
                        onDragEnter: this.handleDragEnter,
                        onDragLeave: this.handleDragLeave,
                        onDragOver: this.handleDragOver,
                        onDrop: this.handleDrop
                    },
                    _react2.default.createElement(
                        "p",
                        null,
                        "Drag .dat files here or"
                    ),
                    _react2.default.createElement(
                        "button",
                        { className: "btn-secondary" },
                        "Browse Files"
                    ),
                    error && _react2.default.createElement(
                        "p",
                        { className: "error-message" },
                        error
                    )
                ),
                _react2.default.createElement("input", { id: "file-input", type: "file", accept: ".dat", ref: this.fileInputRef, onChange: this.handleFileSelect }),
                _react2.default.createElement("hr", null),
                _react2.default.createElement(
                    "div",
                    { className: "save-buttons" },
                    _react2.default.createElement(
                        "button",
                        { className: "btn-secondary", onClick: this.handleSaveJson, disabled: !saveData },
                        "Save .json"
                    ),
                    _react2.default.createElement(
                        "button",
                        { className: "btn-primary", onClick: this.handleSaveEncrypted, disabled: !saveData },
                        "Save Encrypted .dat"
                    )
                ),
                saveData && _react2.default.createElement(
                    "div",
                    { className: "editor-container" },
                    _react2.default.createElement(
                        "div",
                        { className: "editor-section" },
                        _react2.default.createElement(
                            "h2",
                            null,
                            "Basic Stats"
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "form-grid" },
                            _react2.default.createElement(
                                "div",
                                { className: "form-group" },
                                _react2.default.createElement(
                                    "label",
                                    { htmlFor: "health" },
                                    "Health"
                                ),
                                _react2.default.createElement("input", { id: "health", type: "number", value: pd.health, onChange: function onChange(e) {
                                        return _this2.handleNumericChange(e, 'playerData', 'health');
                                    } }),
                                _react2.default.createElement(
                                    "span",
                                    { className: "note" },
                                    "Over 11 masks can break the UI."
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "form-group" },
                                _react2.default.createElement(
                                    "label",
                                    { htmlFor: "silk" },
                                    "Silk"
                                ),
                                _react2.default.createElement("input", { id: "silk", type: "number", value: pd.silk, onChange: function onChange(e) {
                                        return _this2.handleNumericChange(e, 'playerData', 'silk');
                                    } }),
                                _react2.default.createElement(
                                    "span",
                                    { className: "note" },
                                    "Max 17."
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "form-group" },
                                _react2.default.createElement(
                                    "label",
                                    { htmlFor: "rosaries" },
                                    "Rosaries"
                                ),
                                _react2.default.createElement("input", { id: "rosaries", type: "number", value: pd.geo, onChange: function onChange(e) {
                                        return _this2.handleNumericChange(e, 'playerData', 'geo');
                                    } })
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "editor-section" },
                        _react2.default.createElement(
                            "h2",
                            null,
                            "Upgrades ",
                            _react2.default.createElement(
                                "span",
                                { className: "note" },
                                "(Warning: Spoilers)"
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "form-grid" },
                            _react2.default.createElement(
                                "div",
                                { className: "form-group" },
                                _react2.default.createElement(
                                    "label",
                                    { htmlFor: "nailUpgrades" },
                                    "Needle Upgrades"
                                ),
                                _react2.default.createElement("input", { id: "nailUpgrades", type: "number", value: pd.nailUpgrades, onChange: function onChange(e) {
                                        return _this2.handleNumericChange(e, 'playerData', 'nailUpgrades');
                                    } }),
                                _react2.default.createElement(
                                    "span",
                                    { className: "note" },
                                    "Value from 0 to 4."
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "form-group" },
                                _react2.default.createElement(
                                    "label",
                                    { htmlFor: "hasNeedleThrow" },
                                    "Has Needle Throw"
                                ),
                                _react2.default.createElement(
                                    "div",
                                    { className: "checkbox-group" },
                                    _react2.default.createElement("input", { id: "hasNeedleThrow", type: "checkbox", checked: pd.hasNeedleThrow, onChange: function onChange(e) {
                                            return _this2.handleCheckboxChange(e, 'playerData', 'hasNeedleThrow');
                                        } })
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "editor-section" },
                        _react2.default.createElement(
                            "h2",
                            null,
                            "Map"
                        ),
                        _react2.default.createElement(
                            "p",
                            { className: "note" },
                            "Map editing features are coming soon."
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "editor-section" },
                        _react2.default.createElement(
                            "h2",
                            null,
                            "Enemies Seen"
                        ),
                        _react2.default.createElement(
                            "p",
                            { className: "note" },
                            "Bestiary editing features are coming soon."
                        )
                    )
                )
            );
        }
    }]);

    return App;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.querySelector("#root"));

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Flcy1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS9janMvcmVhY3QtZG9tLmRldmVsb3BtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jhc2U2NC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzPzhmMzQiXSwibmFtZXMiOlsiZW5jb2RlIiwiZGVjb2RlIiwiQkFTRTY0X0FSUkFZIiwic3BsaXQiLCJtYXAiLCJjIiwiY2hhckNvZGVBdCIsIkJBU0U2NF9FTkNPREVfVEFCTEUiLCJNYXAiLCJvcmQiLCJpIiwiQkFTRTY0X0RFQ09ERV9UQUJMRSIsImJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJzbGljZSIsIm91dHB1dCIsIk1hdGgiLCJjZWlsIiwibGVuZ3RoIiwiY29udGludW91cyIsImZsb29yIiwiayIsImdldCIsInVuZGVmaW5lZCIsInYiLCJwIiwiaW5kZXhPZiIsInN1YmFycmF5IiwiU3RyaW5nVG9CeXRlcyIsIkJ5dGVzVG9TdHJpbmciLCJBRVNEZWNyeXB0IiwiQUVTRW5jcnlwdCIsIkdlbmVyYXRlTGVuZ3RoUHJlZml4ZWRTdHJpbmciLCJBZGRIZWFkZXIiLCJSZW1vdmVIZWFkZXIiLCJEZWNvZGUiLCJFbmNvZGUiLCJIYXNoIiwiSHVtYW5UaW1lIiwiRG93bmxvYWREYXRhIiwiYmFzZTY0IiwiY1NoYXJwSGVhZGVyIiwiYWVzS2V5IiwiZWNiIiwiYWVzIiwiU3RyaW5nIiwicHJvdG90eXBlIiwicmV2ZXJzZSIsImpvaW4iLCJzdHJpbmciLCJUZXh0RW5jb2RlciIsImJ5dGVzIiwiVGV4dERlY29kZXIiLCJkYXRhIiwiZGVjcnlwdCIsInBhZFZhbHVlIiwicGFkZGVkIiwiZmlsbCIsInNldCIsImVuY3J5cHQiLCJtaW4iLCJwdXNoIiwibGVuZ3RoRGF0YSIsIm5ld0J5dGVzIiwibGVuZ3RoQ291bnQiLCJqc29uU3RyaW5nIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsInZhbHVlIiwicHJlY2lzaW9uIiwibXVsdGkiLCJwb3ciLCJkYXRlIiwibWludXRlcyIsIkRhdGUiLCJob3VycyIsImRheXMiLCJ3ZWVrcyIsIm1vbnRocyIsInllYXJzIiwiZmlsZU5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJ3aW5kb3ciLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJCbG9iIiwidHlwZSIsImJvZHkiLCJhcHBlbmQiLCJjbGljayIsInJlbW92ZUNoaWxkIiwiQXBwIiwic3RhdGUiLCJzYXZlRGF0YSIsImRyYWdnaW5nIiwiZXJyb3IiLCJoYW5kbGVEcmFnRW50ZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJzZXRTdGF0ZSIsImhhbmRsZURyYWdMZWF2ZSIsImhhbmRsZURyYWdPdmVyIiwiaGFuZGxlRHJvcCIsImZpbGVzIiwiZGF0YVRyYW5zZmVyIiwiaGFuZGxlRmlsZSIsImhhbmRsZUJyb3dzZUNsaWNrIiwiZmlsZUlucHV0UmVmIiwiY3VycmVudCIsImhhbmRsZUZpbGVTZWxlY3QiLCJmaWxlIiwidGFyZ2V0IiwibmFtZSIsInRvTG93ZXJDYXNlIiwiZW5kc1dpdGgiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwicmVhZEFzQXJyYXlCdWZmZXIiLCJvbmxvYWQiLCJyZXN1bHQiLCJkZWNyeXB0ZWQiLCJwYXJzZWREYXRhIiwiSlNPTiIsInBhcnNlIiwiZXJyIiwiY29uc29sZSIsImhhbmRsZU51bWVyaWNDaGFuZ2UiLCJrZXlzIiwicGFyc2VJbnQiLCJuZXdTdGF0ZSIsInN0cmluZ2lmeSIsInByZXZTdGF0ZSIsImluY2x1ZGVzIiwicGxheWVyRGF0YSIsIm1heEhlYWx0aCIsInNpbGtNYXgiLCJoYW5kbGVDaGVja2JveENoYW5nZSIsImNoZWNrZWQiLCJoYW5kbGVTYXZlRW5jcnlwdGVkIiwiZW5jcnlwdGVkIiwiaGFuZGxlU2F2ZUpzb24iLCJuZXdGaWxlTmFtZSIsInJlcGxhY2UiLCJSZWFjdCIsImNyZWF0ZVJlZiIsInBkIiwiaGVhbHRoIiwic2lsayIsImdlbyIsIm5haWxVcGdyYWRlcyIsImhhc05lZWRsZVRocm93IiwiQ29tcG9uZW50IiwiUmVhY3RET00iLCJyZW5kZXIiLCJxdWVyeVNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFxQztBQUMzQztBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViOztBQUVBOzs7Ozs7Ozs7Ozs7QUNYQTs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTtBQUNiLEtBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixtQkFBTyxDQUFDLDRDQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7Ozs7Ozs7Ozs7Ozs7QUN2YVU7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBcUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxLQUFxQyxFQUFFLEVBSzFDO0FBQ0QsbUJBQW1CLG1CQUFPLENBQUMsNkZBQWdDO0FBQzNEOzs7Ozs7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7Ozs7QUFJYixJQUFJLElBQXFDO0FBQ3pDO0FBQ0E7O0FBRUEsY0FBYyxtQkFBTyxDQUFDLDREQUFlO0FBQ3JDLHFCQUFxQixtQkFBTyxDQUFDLDhFQUEyQjs7QUFFeEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FB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QUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssRUFBRTs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxFQUFFO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlOztBQUVm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QUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0EseUNBQXlDO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxFQUFFO0FBQ2I7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDBEQUEwRDtB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QUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQzFYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FB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Q0FBSyxXQUFVLFlBQWY7QUFDSztBQUFBO0FBQUEsc0NBQU8sU0FBUSxnQkFBZjtBQUFBO0FBQUEsaUNBREw7QUFFSztBQUFBO0FBQUEsc0NBQUssV0FBVSxnQkFBZjtBQUNJLDZFQUFPLElBQUcsZ0JBQVYsRUFBMkIsTUFBSyxVQUFoQyxFQUEyQyxTQUFTaUQsR0FBR0ssY0FBdkQsRUFBdUUsVUFBVSxrQkFBQ3RELENBQUQ7QUFBQSxtREFBTyxPQUFLd0Msb0JBQUwsQ0FBMEJ4QyxDQUExQixFQUE2QixZQUE3QixFQUEyQyxnQkFBM0MsQ0FBUDtBQUFBLHlDQUFqRjtBQURKO0FBRkw7QUFOSjtBQUZKLHFCQXJCSjtBQXNDSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxnQkFBZjtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBREo7QUFFSTtBQUFBO0FBQUEsOEJBQUcsV0FBVSxNQUFiO0FBQUE7QUFBQTtBQUZKLHFCQXRDSjtBQTJDSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxnQkFBZjtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBREo7QUFFSTtBQUFBO0FBQUEsOEJBQUcsV0FBVSxNQUFiO0FBQUE7QUFBQTtBQUZKO0FBM0NKO0FBaERSLGFBREo7QUFvR0g7Ozs7RUFyUGErQyxnQkFBTVEsUzs7QUF3UHhCQyxtQkFBU0MsTUFBVCxDQUFnQiw4QkFBQyxHQUFELE9BQWhCLEVBQXlCM0UsU0FBUzRFLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBekIsRTs7Ozs7Ozs7Ozs7O0FDNVBBLGNBQWMsbUJBQU8sQ0FBQyxrSEFBc0Q7O0FBRTVFLDRDQUE0QyxRQUFTOztBQUVyRDtBQUNBOzs7O0FBSUEsZUFBZTs7QUFFZjtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQyxtR0FBZ0Q7O0FBRXJFOztBQUVBLEdBQUcsS0FBVSxFQUFFLEUiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIvKiEgTUlUIExpY2Vuc2UuIENvcHlyaWdodCAyMDE1LTIwMTggUmljaGFyZCBNb29yZSA8bWVAcmljbW9vLmNvbT4uIFNlZSBMSUNFTlNFLnR4dC4gKi9cbihmdW5jdGlvbihyb290KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBmdW5jdGlvbiBjaGVja0ludCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKHBhcnNlSW50KHZhbHVlKSA9PT0gdmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrSW50cyhhcnJheWlzaCkge1xuICAgICAgICBpZiAoIWNoZWNrSW50KGFycmF5aXNoLmxlbmd0aCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheWlzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCFjaGVja0ludChhcnJheWlzaFtpXSkgfHwgYXJyYXlpc2hbaV0gPCAwIHx8IGFycmF5aXNoW2ldID4gMjU1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29lcmNlQXJyYXkoYXJnLCBjb3B5KSB7XG5cbiAgICAgICAgLy8gQXJyYXlCdWZmZXIgdmlld1xuICAgICAgICBpZiAoYXJnLmJ1ZmZlciAmJiBhcmcubmFtZSA9PT0gJ1VpbnQ4QXJyYXknKSB7XG5cbiAgICAgICAgICAgIGlmIChjb3B5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZy5zbGljZSkge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmcgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0J3MgYW4gYXJyYXk7IGNoZWNrIGl0IGlzIGEgdmFsaWQgcmVwcmVzZW50YXRpb24gb2YgYSBieXRlXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgICAgIGlmICghY2hlY2tJbnRzKGFyZykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FycmF5IGNvbnRhaW5zIGludmFsaWQgdmFsdWU6ICcgKyBhcmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvbWV0aGluZyBlbHNlLCBidXQgYmVoYXZlcyBsaWtlIGFuIGFycmF5IChtYXliZSBhIEJ1ZmZlcj8gQXJndW1lbnRzPylcbiAgICAgICAgaWYgKGNoZWNrSW50KGFyZy5sZW5ndGgpICYmIGNoZWNrSW50cyhhcmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgYXJyYXktbGlrZSBvYmplY3QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVBcnJheShsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGxlbmd0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZUFycmF5LCB0YXJnZXRBcnJheSwgdGFyZ2V0U3RhcnQsIHNvdXJjZVN0YXJ0LCBzb3VyY2VFbmQpIHtcbiAgICAgICAgaWYgKHNvdXJjZVN0YXJ0ICE9IG51bGwgfHwgc291cmNlRW5kICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2VBcnJheS5zbGljZSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZUFycmF5ID0gc291cmNlQXJyYXkuc2xpY2Uoc291cmNlU3RhcnQsIHNvdXJjZUVuZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvdXJjZUFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc291cmNlQXJyYXksIHNvdXJjZVN0YXJ0LCBzb3VyY2VFbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRhcmdldEFycmF5LnNldChzb3VyY2VBcnJheSwgdGFyZ2V0U3RhcnQpO1xuICAgIH1cblxuXG5cbiAgICB2YXIgY29udmVydFV0ZjggPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIHRvQnl0ZXModGV4dCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdLCBpID0gMDtcbiAgICAgICAgICAgIHRleHQgPSBlbmNvZGVVUkkodGV4dCk7XG4gICAgICAgICAgICB3aGlsZSAoaSA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0ZXh0LmNoYXJDb2RlQXQoaSsrKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGl0IGlzIGEgJSBzaWduLCBlbmNvZGUgdGhlIGZvbGxvd2luZyAyIGJ5dGVzIGFzIGEgaGV4IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDM3KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhcnNlSW50KHRleHQuc3Vic3RyKGksIDIpLCAxNikpXG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMjtcblxuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSwganVzdCB0aGUgYWN0dWFsIGJ5dGVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvZXJjZUFycmF5KHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmcm9tQnl0ZXMoYnl0ZXMpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXSwgaSA9IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChpIDwgYnl0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBieXRlc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmIChjIDwgMTI4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYykpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID4gMTkxICYmIGMgPCAyMjQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDFmKSA8PCA2KSB8IChieXRlc1tpICsgMV0gJiAweDNmKSkpO1xuICAgICAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDBmKSA8PCAxMikgfCAoKGJ5dGVzW2kgKyAxXSAmIDB4M2YpIDw8IDYpIHwgKGJ5dGVzW2kgKyAyXSAmIDB4M2YpKSk7XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9CeXRlczogdG9CeXRlcyxcbiAgICAgICAgICAgIGZyb21CeXRlczogZnJvbUJ5dGVzLFxuICAgICAgICB9XG4gICAgfSkoKTtcblxuICAgIHZhciBjb252ZXJ0SGV4ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiB0b0J5dGVzKHRleHQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhcnNlSW50KHRleHQuc3Vic3RyKGksIDIpLCAxNikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaHR0cDovL2l4dGkubmV0L2RldmVsb3BtZW50L2phdmFzY3JpcHQvMjAxMS8xMS8xMS9iYXNlNjQtZW5jb2RlZGVjb2RlLW9mLXV0ZjgtaW4tYnJvd3Nlci13aXRoLWpzLmh0bWxcbiAgICAgICAgdmFyIEhleCA9ICcwMTIzNDU2Nzg5YWJjZGVmJztcblxuICAgICAgICBmdW5jdGlvbiBmcm9tQnl0ZXMoYnl0ZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IGJ5dGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChIZXhbKHYgJiAweGYwKSA+PiA0XSArIEhleFt2ICYgMHgwZl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvQnl0ZXM6IHRvQnl0ZXMsXG4gICAgICAgICAgICBmcm9tQnl0ZXM6IGZyb21CeXRlcyxcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cblxuICAgIC8vIE51bWJlciBvZiByb3VuZHMgYnkga2V5c2l6ZVxuICAgIHZhciBudW1iZXJPZlJvdW5kcyA9IHsxNjogMTAsIDI0OiAxMiwgMzI6IDE0fVxuXG4gICAgLy8gUm91bmQgY29uc3RhbnQgd29yZHNcbiAgICB2YXIgcmNvbiA9IFsweDAxLCAweDAyLCAweDA0LCAweDA4LCAweDEwLCAweDIwLCAweDQwLCAweDgwLCAweDFiLCAweDM2LCAweDZjLCAweGQ4LCAweGFiLCAweDRkLCAweDlhLCAweDJmLCAweDVlLCAweGJjLCAweDYzLCAweGM2LCAweDk3LCAweDM1LCAweDZhLCAweGQ0LCAweGIzLCAweDdkLCAweGZhLCAweGVmLCAweGM1LCAweDkxXTtcblxuICAgIC8vIFMtYm94IGFuZCBJbnZlcnNlIFMtYm94IChTIGlzIGZvciBTdWJzdGl0dXRpb24pXG4gICAgdmFyIFMgPSBbMHg2MywgMHg3YywgMHg3NywgMHg3YiwgMHhmMiwgMHg2YiwgMHg2ZiwgMHhjNSwgMHgzMCwgMHgwMSwgMHg2NywgMHgyYiwgMHhmZSwgMHhkNywgMHhhYiwgMHg3NiwgMHhjYSwgMHg4MiwgMHhjOSwgMHg3ZCwgMHhmYSwgMHg1OSwgMHg0NywgMHhmMCwgMHhhZCwgMHhkNCwgMHhhMiwgMHhhZiwgMHg5YywgMHhhNCwgMHg3MiwgMHhjMCwgMHhiNywgMHhmZCwgMHg5MywgMHgyNiwgMHgzNiwgMHgzZiwgMHhmNywgMHhjYywgMHgzNCwgMHhhNSwgMHhlNSwgMHhmMSwgMHg3MSwgMHhkOCwgMHgzMSwgMHgxNSwgMHgwNCwgMHhjNywgMHgyMywgMHhjMywgMHgxOCwgMHg5NiwgMHgwNSwgMHg5YSwgMHgwNywgMHgxMiwgMHg4MCwgMHhlMiwgMHhlYiwgMHgyNywgMHhiMiwgMHg3NSwgMHgwOSwgMHg4MywgMHgyYywgMHgxYSwgMHgxYiwgMHg2ZSwgMHg1YSwgMHhhMCwgMHg1MiwgMHgzYiwgMHhkNiwgMHhiMywgMHgyOSwgMHhlMywgMHgyZiwgMHg4NCwgMHg1MywgMHhkMSwgMHgwMCwgMHhlZCwgMHgyMCwgMHhmYywgMHhiMSwgMHg1YiwgMHg2YSwgMHhjYiwgMHhiZSwgMHgzOSwgMHg0YSwgMHg0YywgMHg1OCwgMHhjZiwgMHhkMCwgMHhlZiwgMHhhYSwgMHhmYiwgMHg0MywgMHg0ZCwgMHgzMywgMHg4NSwgMHg0NSwgMHhmOSwgMHgwMiwgMHg3ZiwgMHg1MCwgMHgzYywgMHg5ZiwgMHhhOCwgMHg1MSwgMHhhMywgMHg0MCwgMHg4ZiwgMHg5MiwgMHg5ZCwgMHgzOCwgMHhmNSwgMHhiYywgMHhiNiwgMHhkYSwgMHgyMSwgMHgxMCwgMHhmZiwgMHhmMywgMHhkMiwgMHhjZCwgMHgwYywgMHgxMywgMHhlYywgMHg1ZiwgMHg5NywgMHg0NCwgMHgxNywgMHhjNCwgMHhhNywgMHg3ZSwgMHgzZCwgMHg2NCwgMHg1ZCwgMHgxOSwgMHg3MywgMHg2MCwgMHg4MSwgMHg0ZiwgMHhkYywgMHgyMiwgMHgyYSwgMHg5MCwgMHg4OCwgMHg0NiwgMHhlZSwgMHhiOCwgMHgxNCwgMHhkZSwgMHg1ZSwgMHgwYiwgMHhkYiwgMHhlMCwgMHgzMiwgMHgzYSwgMHgwYSwgMHg0OSwgMHgwNiwgMHgyNCwgMHg1YywgMHhjMiwgMHhkMywgMHhhYywgMHg2MiwgMHg5MSwgMHg5NSwgMHhlNCwgMHg3OSwgMHhlNywgMHhjOCwgMHgzNywgMHg2ZCwgMHg4ZCwgMHhkNSwgMHg0ZSwgMHhhOSwgMHg2YywgMHg1NiwgMHhmNCwgMHhlYSwgMHg2NSwgMHg3YSwgMHhhZSwgMHgwOCwgMHhiYSwgMHg3OCwgMHgyNSwgMHgyZSwgMHgxYywgMHhhNiwgMHhiNCwgMHhjNiwgMHhlOCwgMHhkZCwgMHg3NCwgMHgxZiwgMHg0YiwgMHhiZCwgMHg4YiwgMHg4YSwgMHg3MCwgMHgzZSwgMHhiNSwgMHg2NiwgMHg0OCwgMHgwMywgMHhmNiwgMHgwZSwgMHg2MSwgMHgzNSwgMHg1NywgMHhiOSwgMHg4NiwgMHhjMSwgMHgxZCwgMHg5ZSwgMHhlMSwgMHhmOCwgMHg5OCwgMHgxMSwgMHg2OSwgMHhkOSwgMHg4ZSwgMHg5NCwgMHg5YiwgMHgxZSwgMHg4NywgMHhlOSwgMHhjZSwgMHg1NSwgMHgyOCwgMHhkZiwgMHg4YywgMHhhMSwgMHg4OSwgMHgwZCwgMHhiZiwgMHhlNiwgMHg0MiwgMHg2OCwgMHg0MSwgMHg5OSwgMHgyZCwgMHgwZiwgMHhiMCwgMHg1NCwgMHhiYiwgMHgxNl07XG4gICAgdmFyIFNpID1bMHg1MiwgMHgwOSwgMHg2YSwgMHhkNSwgMHgzMCwgMHgzNiwgMHhhNSwgMHgzOCwgMHhiZiwgMHg0MCwgMHhhMywgMHg5ZSwgMHg4MSwgMHhmMywgMHhkNywgMHhmYiwgMHg3YywgMHhlMywgMHgzOSwgMHg4MiwgMHg5YiwgMHgyZiwgMHhmZiwgMHg4NywgMHgzNCwgMHg4ZSwgMHg0MywgMHg0NCwgMHhjNCwgMHhkZSwgMHhlOSwgMHhjYiwgMHg1NCwgMHg3YiwgMHg5NCwgMHgzMiwgMHhhNiwgMHhjMiwgMHgyMywgMHgzZCwgMHhlZSwgMHg0YywgMHg5NSwgMHgwYiwgMHg0MiwgMHhmYSwgMHhjMywgMHg0ZSwgMHgwOCwgMHgyZSwgMHhhMSwgMHg2NiwgMHgyOCwgMHhkOSwgMHgyNCwgMHhiMiwgMHg3NiwgMHg1YiwgMHhhMiwgMHg0OSwgMHg2ZCwgMHg4YiwgMHhkMSwgMHgyNSwgMHg3MiwgMHhmOCwgMHhmNiwgMHg2NCwgMHg4NiwgMHg2OCwgMHg5OCwgMHgxNiwgMHhkNCwgMHhhNCwgMHg1YywgMHhjYywgMHg1ZCwgMHg2NSwgMHhiNiwgMHg5MiwgMHg2YywgMHg3MCwgMHg0OCwgMHg1MCwgMHhmZCwgMHhlZCwgMHhiOSwgMHhkYSwgMHg1ZSwgMHgxNSwgMHg0NiwgMHg1NywgMHhhNywgMHg4ZCwgMHg5ZCwgMHg4NCwgMHg5MCwgMHhkOCwgMHhhYiwgMHgwMCwgMHg4YywgMHhiYywgMHhkMywgMHgwYSwgMHhmNywgMHhlNCwgMHg1OCwgMHgwNSwgMHhiOCwgMHhiMywgMHg0NSwgMHgwNiwgMHhkMCwgMHgyYywgMHgxZSwgMHg4ZiwgMHhjYSwgMHgzZiwgMHgwZiwgMHgwMiwgMHhjMSwgMHhhZiwgMHhiZCwgMHgwMywgMHgwMSwgMHgxMywgMHg4YSwgMHg2YiwgMHgzYSwgMHg5MSwgMHgxMSwgMHg0MSwgMHg0ZiwgMHg2NywgMHhkYywgMHhlYSwgMHg5NywgMHhmMiwgMHhjZiwgMHhjZSwgMHhmMCwgMHhiNCwgMHhlNiwgMHg3MywgMHg5NiwgMHhhYywgMHg3NCwgMHgyMiwgMHhlNywgMHhhZCwgMHgzNSwgMHg4NSwgMHhlMiwgMHhmOSwgMHgzNywgMHhlOCwgMHgxYywgMHg3NSwgMHhkZiwgMHg2ZSwgMHg0NywgMHhmMSwgMHgxYSwgMHg3MSwgMHgxZCwgMHgyOSwgMHhjNSwgMHg4OSwgMHg2ZiwgMHhiNywgMHg2MiwgMHgwZSwgMHhhYSwgMHgxOCwgMHhiZSwgMHgxYiwgMHhmYywgMHg1NiwgMHgzZSwgMHg0YiwgMHhjNiwgMHhkMiwgMHg3OSwgMHgyMCwgMHg5YSwgMHhkYiwgMHhjMCwgMHhmZSwgMHg3OCwgMHhjZCwgMHg1YSwgMHhmNCwgMHgxZiwgMHhkZCwgMHhhOCwgMHgzMywgMHg4OCwgMHgwNywgMHhjNywgMHgzMSwgMHhiMSwgMHgxMiwgMHgxMCwgMHg1OSwgMHgyNywgMHg4MCwgMHhlYywgMHg1ZiwgMHg2MCwgMHg1MSwgMHg3ZiwgMHhhOSwgMHgxOSwgMHhiNSwgMHg0YSwgMHgwZCwgMHgyZCwgMHhlNSwgMHg3YSwgMHg5ZiwgMHg5MywgMHhjOSwgMHg5YywgMHhlZiwgMHhhMCwgMHhlMCwgMHgzYiwgMHg0ZCwgMHhhZSwgMHgyYSwgMHhmNSwgMHhiMCwgMHhjOCwgMHhlYiwgMHhiYiwgMHgzYywgMHg4MywgMHg1MywgMHg5OSwgMHg2MSwgMHgxNywgMHgyYiwgMHgwNCwgMHg3ZSwgMHhiYSwgMHg3NywgMHhkNiwgMHgyNiwgMHhlMSwgMHg2OSwgMHgxNCwgMHg2MywgMHg1NSwgMHgyMSwgMHgwYywgMHg3ZF07XG5cbiAgICAvLyBUcmFuc2Zvcm1hdGlvbnMgZm9yIGVuY3J5cHRpb25cbiAgICB2YXIgVDEgPSBbMHhjNjYzNjNhNSwgMHhmODdjN2M4NCwgMHhlZTc3Nzc5OSwgMHhmNjdiN2I4ZCwgMHhmZmYyZjIwZCwgMHhkNjZiNmJiZCwgMHhkZTZmNmZiMSwgMHg5MWM1YzU1NCwgMHg2MDMwMzA1MCwgMHgwMjAxMDEwMywgMHhjZTY3NjdhOSwgMHg1NjJiMmI3ZCwgMHhlN2ZlZmUxOSwgMHhiNWQ3ZDc2MiwgMHg0ZGFiYWJlNiwgMHhlYzc2NzY5YSwgMHg4ZmNhY2E0NSwgMHgxZjgyODI5ZCwgMHg4OWM5Yzk0MCwgMHhmYTdkN2Q4NywgMHhlZmZhZmExNSwgMHhiMjU5NTllYiwgMHg4ZTQ3NDdjOSwgMHhmYmYwZjAwYiwgMHg0MWFkYWRlYywgMHhiM2Q0ZDQ2NywgMHg1ZmEyYTJmZCwgMHg0NWFmYWZlYSwgMHgyMzljOWNiZiwgMHg1M2E0YTRmNywgMHhlNDcyNzI5NiwgMHg5YmMwYzA1YiwgMHg3NWI3YjdjMiwgMHhlMWZkZmQxYywgMHgzZDkzOTNhZSwgMHg0YzI2MjY2YSwgMHg2YzM2MzY1YSwgMHg3ZTNmM2Y0MSwgMHhmNWY3ZjcwMiwgMHg4M2NjY2M0ZiwgMHg2ODM0MzQ1YywgMHg1MWE1YTVmNCwgMHhkMWU1ZTUzNCwgMHhmOWYxZjEwOCwgMHhlMjcxNzE5MywgMHhhYmQ4ZDg3MywgMHg2MjMxMzE1MywgMHgyYTE1MTUzZiwgMHgwODA0MDQwYywgMHg5NWM3Yzc1MiwgMHg0NjIzMjM2NSwgMHg5ZGMzYzM1ZSwgMHgzMDE4MTgyOCwgMHgzNzk2OTZhMSwgMHgwYTA1MDUwZiwgMHgyZjlhOWFiNSwgMHgwZTA3MDcwOSwgMHgyNDEyMTIzNiwgMHgxYjgwODA5YiwgMHhkZmUyZTIzZCwgMHhjZGViZWIyNiwgMHg0ZTI3Mjc2OSwgMHg3ZmIyYjJjZCwgMHhlYTc1NzU5ZiwgMHgxMjA5MDkxYiwgMHgxZDgzODM5ZSwgMHg1ODJjMmM3NCwgMHgzNDFhMWEyZSwgMHgzNjFiMWIyZCwgMHhkYzZlNmViMiwgMHhiNDVhNWFlZSwgMHg1YmEwYTBmYiwgMHhhNDUyNTJmNiwgMHg3NjNiM2I0ZCwgMHhiN2Q2ZDY2MSwgMHg3ZGIzYjNjZSwgMHg1MjI5Mjk3YiwgMHhkZGUzZTMzZSwgMHg1ZTJmMmY3MSwgMHgxMzg0ODQ5NywgMHhhNjUzNTNmNSwgMHhiOWQxZDE2OCwgMHgwMDAwMDAwMCwgMHhjMWVkZWQyYywgMHg0MDIwMjA2MCwgMHhlM2ZjZmMxZiwgMHg3OWIxYjFjOCwgMHhiNjViNWJlZCwgMHhkNDZhNmFiZSwgMHg4ZGNiY2I0NiwgMHg2N2JlYmVkOSwgMHg3MjM5Mzk0YiwgMHg5NDRhNGFkZSwgMHg5ODRjNGNkNCwgMHhiMDU4NThlOCwgMHg4NWNmY2Y0YSwgMHhiYmQwZDA2YiwgMHhjNWVmZWYyYSwgMHg0ZmFhYWFlNSwgMHhlZGZiZmIxNiwgMHg4NjQzNDNjNSwgMHg5YTRkNGRkNywgMHg2NjMzMzM1NSwgMHgxMTg1ODU5NCwgMHg4YTQ1NDVjZiwgMHhlOWY5ZjkxMCwgMHgwNDAyMDIwNiwgMHhmZTdmN2Y4MSwgMHhhMDUwNTBmMCwgMHg3ODNjM2M0NCwgMHgyNTlmOWZiYSwgMHg0YmE4YThlMywgMHhhMjUxNTFmMywgMHg1ZGEzYTNmZSwgMHg4MDQwNDBjMCwgMHgwNThmOGY4YSwgMHgzZjkyOTJhZCwgMHgyMTlkOWRiYywgMHg3MDM4Mzg0OCwgMHhmMWY1ZjUwNCwgMHg2M2JjYmNkZiwgMHg3N2I2YjZjMSwgMHhhZmRhZGE3NSwgMHg0MjIxMjE2MywgMHgyMDEwMTAzMCwgMHhlNWZmZmYxYSwgMHhmZGYzZjMwZSwgMHhiZmQyZDI2ZCwgMHg4MWNkY2Q0YywgMHgxODBjMGMxNCwgMHgyNjEzMTMzNSwgMHhjM2VjZWMyZiwgMHhiZTVmNWZlMSwgMHgzNTk3OTdhMiwgMHg4ODQ0NDRjYywgMHgyZTE3MTczOSwgMHg5M2M0YzQ1NywgMHg1NWE3YTdmMiwgMHhmYzdlN2U4MiwgMHg3YTNkM2Q0NywgMHhjODY0NjRhYywgMHhiYTVkNWRlNywgMHgzMjE5MTkyYiwgMHhlNjczNzM5NSwgMHhjMDYwNjBhMCwgMHgxOTgxODE5OCwgMHg5ZTRmNGZkMSwgMHhhM2RjZGM3ZiwgMHg0NDIyMjI2NiwgMHg1NDJhMmE3ZSwgMHgzYjkwOTBhYiwgMHgwYjg4ODg4MywgMHg4YzQ2NDZjYSwgMHhjN2VlZWUyOSwgMHg2YmI4YjhkMywgMHgyODE0MTQzYywgMHhhN2RlZGU3OSwgMHhiYzVlNWVlMiwgMHgxNjBiMGIxZCwgMHhhZGRiZGI3NiwgMHhkYmUwZTAzYiwgMHg2NDMyMzI1NiwgMHg3NDNhM2E0ZSwgMHgxNDBhMGExZSwgMHg5MjQ5NDlkYiwgMHgwYzA2MDYwYSwgMHg0ODI0MjQ2YywgMHhiODVjNWNlNCwgMHg5ZmMyYzI1ZCwgMHhiZGQzZDM2ZSwgMHg0M2FjYWNlZiwgMHhjNDYyNjJhNiwgMHgzOTkxOTFhOCwgMHgzMTk1OTVhNCwgMHhkM2U0ZTQzNywgMHhmMjc5Nzk4YiwgMHhkNWU3ZTczMiwgMHg4YmM4Yzg0MywgMHg2ZTM3Mzc1OSwgMHhkYTZkNmRiNywgMHgwMThkOGQ4YywgMHhiMWQ1ZDU2NCwgMHg5YzRlNGVkMiwgMHg0OWE5YTllMCwgMHhkODZjNmNiNCwgMHhhYzU2NTZmYSwgMHhmM2Y0ZjQwNywgMHhjZmVhZWEyNSwgMHhjYTY1NjVhZiwgMHhmNDdhN2E4ZSwgMHg0N2FlYWVlOSwgMHgxMDA4MDgxOCwgMHg2ZmJhYmFkNSwgMHhmMDc4Nzg4OCwgMHg0YTI1MjU2ZiwgMHg1YzJlMmU3MiwgMHgzODFjMWMyNCwgMHg1N2E2YTZmMSwgMHg3M2I0YjRjNywgMHg5N2M2YzY1MSwgMHhjYmU4ZTgyMywgMHhhMWRkZGQ3YywgMHhlODc0NzQ5YywgMHgzZTFmMWYyMSwgMHg5NjRiNGJkZCwgMHg2MWJkYmRkYywgMHgwZDhiOGI4NiwgMHgwZjhhOGE4NSwgMHhlMDcwNzA5MCwgMHg3YzNlM2U0MiwgMHg3MWI1YjVjNCwgMHhjYzY2NjZhYSwgMHg5MDQ4NDhkOCwgMHgwNjAzMDMwNSwgMHhmN2Y2ZjYwMSwgMHgxYzBlMGUxMiwgMHhjMjYxNjFhMywgMHg2YTM1MzU1ZiwgMHhhZTU3NTdmOSwgMHg2OWI5YjlkMCwgMHgxNzg2ODY5MSwgMHg5OWMxYzE1OCwgMHgzYTFkMWQyNywgMHgyNzllOWViOSwgMHhkOWUxZTEzOCwgMHhlYmY4ZjgxMywgMHgyYjk4OThiMywgMHgyMjExMTEzMywgMHhkMjY5NjliYiwgMHhhOWQ5ZDk3MCwgMHgwNzhlOGU4OSwgMHgzMzk0OTRhNywgMHgyZDliOWJiNiwgMHgzYzFlMWUyMiwgMHgxNTg3ODc5MiwgMHhjOWU5ZTkyMCwgMHg4N2NlY2U0OSwgMHhhYTU1NTVmZiwgMHg1MDI4Mjg3OCwgMHhhNWRmZGY3YSwgMHgwMzhjOGM4ZiwgMHg1OWExYTFmOCwgMHgwOTg5ODk4MCwgMHgxYTBkMGQxNywgMHg2NWJmYmZkYSwgMHhkN2U2ZTYzMSwgMHg4NDQyNDJjNiwgMHhkMDY4NjhiOCwgMHg4MjQxNDFjMywgMHgyOTk5OTliMCwgMHg1YTJkMmQ3NywgMHgxZTBmMGYxMSwgMHg3YmIwYjBjYiwgMHhhODU0NTRmYywgMHg2ZGJiYmJkNiwgMHgyYzE2MTYzYV07XG4gICAgdmFyIFQyID0gWzB4YTVjNjYzNjMsIDB4ODRmODdjN2MsIDB4OTllZTc3NzcsIDB4OGRmNjdiN2IsIDB4MGRmZmYyZjIsIDB4YmRkNjZiNmIsIDB4YjFkZTZmNmYsIDB4NTQ5MWM1YzUsIDB4NTA2MDMwMzAsIDB4MDMwMjAxMDEsIDB4YTljZTY3NjcsIDB4N2Q1NjJiMmIsIDB4MTllN2ZlZmUsIDB4NjJiNWQ3ZDcsIDB4ZTY0ZGFiYWIsIDB4OWFlYzc2NzYsIDB4NDU4ZmNhY2EsIDB4OWQxZjgyODIsIDB4NDA4OWM5YzksIDB4ODdmYTdkN2QsIDB4MTVlZmZhZmEsIDB4ZWJiMjU5NTksIDB4Yzk4ZTQ3NDcsIDB4MGJmYmYwZjAsIDB4ZWM0MWFkYWQsIDB4NjdiM2Q0ZDQsIDB4ZmQ1ZmEyYTIsIDB4ZWE0NWFmYWYsIDB4YmYyMzljOWMsIDB4Zjc1M2E0YTQsIDB4OTZlNDcyNzIsIDB4NWI5YmMwYzAsIDB4YzI3NWI3YjcsIDB4MWNlMWZkZmQsIDB4YWUzZDkzOTMsIDB4NmE0YzI2MjYsIDB4NWE2YzM2MzYsIDB4NDE3ZTNmM2YsIDB4MDJmNWY3ZjcsIDB4NGY4M2NjY2MsIDB4NWM2ODM0MzQsIDB4ZjQ1MWE1YTUsIDB4MzRkMWU1ZTUsIDB4MDhmOWYxZjEsIDB4OTNlMjcxNzEsIDB4NzNhYmQ4ZDgsIDB4NTM2MjMxMzEsIDB4M2YyYTE1MTUsIDB4MGMwODA0MDQsIDB4NTI5NWM3YzcsIDB4NjU0NjIzMjMsIDB4NWU5ZGMzYzMsIDB4MjgzMDE4MTgsIDB4YTEzNzk2OTYsIDB4MGYwYTA1MDUsIDB4YjUyZjlhOWEsIDB4MDkwZTA3MDcsIDB4MzYyNDEyMTIsIDB4OWIxYjgwODAsIDB4M2RkZmUyZTIsIDB4MjZjZGViZWIsIDB4Njk0ZTI3MjcsIDB4Y2Q3ZmIyYjIsIDB4OWZlYTc1NzUsIDB4MWIxMjA5MDksIDB4OWUxZDgzODMsIDB4NzQ1ODJjMmMsIDB4MmUzNDFhMWEsIDB4MmQzNjFiMWIsIDB4YjJkYzZlNmUsIDB4ZWViNDVhNWEsIDB4ZmI1YmEwYTAsIDB4ZjZhNDUyNTIsIDB4NGQ3NjNiM2IsIDB4NjFiN2Q2ZDYsIDB4Y2U3ZGIzYjMsIDB4N2I1MjI5MjksIDB4M2VkZGUzZTMsIDB4NzE1ZTJmMmYsIDB4OTcxMzg0ODQsIDB4ZjVhNjUzNTMsIDB4NjhiOWQxZDEsIDB4MDAwMDAwMDAsIDB4MmNjMWVkZWQsIDB4NjA0MDIwMjAsIDB4MWZlM2ZjZmMsIDB4Yzg3OWIxYjEsIDB4ZWRiNjViNWIsIDB4YmVkNDZhNmEsIDB4NDY4ZGNiY2IsIDB4ZDk2N2JlYmUsIDB4NGI3MjM5MzksIDB4ZGU5NDRhNGEsIDB4ZDQ5ODRjNGMsIDB4ZThiMDU4NTgsIDB4NGE4NWNmY2YsIDB4NmJiYmQwZDAsIDB4MmFjNWVmZWYsIDB4ZTU0ZmFhYWEsIDB4MTZlZGZiZmIsIDB4YzU4NjQzNDMsIDB4ZDc5YTRkNGQsIDB4NTU2NjMzMzMsIDB4OTQxMTg1ODUsIDB4Y2Y4YTQ1NDUsIDB4MTBlOWY5ZjksIDB4MDYwNDAyMDIsIDB4ODFmZTdmN2YsIDB4ZjBhMDUwNTAsIDB4NDQ3ODNjM2MsIDB4YmEyNTlmOWYsIDB4ZTM0YmE4YTgsIDB4ZjNhMjUxNTEsIDB4ZmU1ZGEzYTMsIDB4YzA4MDQwNDAsIDB4OGEwNThmOGYsIDB4YWQzZjkyOTIsIDB4YmMyMTlkOWQsIDB4NDg3MDM4MzgsIDB4MDRmMWY1ZjUsIDB4ZGY2M2JjYmMsIDB4YzE3N2I2YjYsIDB4NzVhZmRhZGEsIDB4NjM0MjIxMjEsIDB4MzAyMDEwMTAsIDB4MWFlNWZmZmYsIDB4MGVmZGYzZjMsIDB4NmRiZmQyZDIsIDB4NGM4MWNkY2QsIDB4MTQxODBjMGMsIDB4MzUyNjEzMTMsIDB4MmZjM2VjZWMsIDB4ZTFiZTVmNWYsIDB4YTIzNTk3OTcsIDB4Y2M4ODQ0NDQsIDB4MzkyZTE3MTcsIDB4NTc5M2M0YzQsIDB4ZjI1NWE3YTcsIDB4ODJmYzdlN2UsIDB4NDc3YTNkM2QsIDB4YWNjODY0NjQsIDB4ZTdiYTVkNWQsIDB4MmIzMjE5MTksIDB4OTVlNjczNzMsIDB4YTBjMDYwNjAsIDB4OTgxOTgxODEsIDB4ZDE5ZTRmNGYsIDB4N2ZhM2RjZGMsIDB4NjY0NDIyMjIsIDB4N2U1NDJhMmEsIDB4YWIzYjkwOTAsIDB4ODMwYjg4ODgsIDB4Y2E4YzQ2NDYsIDB4MjljN2VlZWUsIDB4ZDM2YmI4YjgsIDB4M2MyODE0MTQsIDB4NzlhN2RlZGUsIDB4ZTJiYzVlNWUsIDB4MWQxNjBiMGIsIDB4NzZhZGRiZGIsIDB4M2JkYmUwZTAsIDB4NTY2NDMyMzIsIDB4NGU3NDNhM2EsIDB4MWUxNDBhMGEsIDB4ZGI5MjQ5NDksIDB4MGEwYzA2MDYsIDB4NmM0ODI0MjQsIDB4ZTRiODVjNWMsIDB4NWQ5ZmMyYzIsIDB4NmViZGQzZDMsIDB4ZWY0M2FjYWMsIDB4YTZjNDYyNjIsIDB4YTgzOTkxOTEsIDB4YTQzMTk1OTUsIDB4MzdkM2U0ZTQsIDB4OGJmMjc5NzksIDB4MzJkNWU3ZTcsIDB4NDM4YmM4YzgsIDB4NTk2ZTM3MzcsIDB4YjdkYTZkNmQsIDB4OGMwMThkOGQsIDB4NjRiMWQ1ZDUsIDB4ZDI5YzRlNGUsIDB4ZTA0OWE5YTksIDB4YjRkODZjNmMsIDB4ZmFhYzU2NTYsIDB4MDdmM2Y0ZjQsIDB4MjVjZmVhZWEsIDB4YWZjYTY1NjUsIDB4OGVmNDdhN2EsIDB4ZTk0N2FlYWUsIDB4MTgxMDA4MDgsIDB4ZDU2ZmJhYmEsIDB4ODhmMDc4NzgsIDB4NmY0YTI1MjUsIDB4NzI1YzJlMmUsIDB4MjQzODFjMWMsIDB4ZjE1N2E2YTYsIDB4Yzc3M2I0YjQsIDB4NTE5N2M2YzYsIDB4MjNjYmU4ZTgsIDB4N2NhMWRkZGQsIDB4OWNlODc0NzQsIDB4MjEzZTFmMWYsIDB4ZGQ5NjRiNGIsIDB4ZGM2MWJkYmQsIDB4ODYwZDhiOGIsIDB4ODUwZjhhOGEsIDB4OTBlMDcwNzAsIDB4NDI3YzNlM2UsIDB4YzQ3MWI1YjUsIDB4YWFjYzY2NjYsIDB4ZDg5MDQ4NDgsIDB4MDUwNjAzMDMsIDB4MDFmN2Y2ZjYsIDB4MTIxYzBlMGUsIDB4YTNjMjYxNjEsIDB4NWY2YTM1MzUsIDB4ZjlhZTU3NTcsIDB4ZDA2OWI5YjksIDB4OTExNzg2ODYsIDB4NTg5OWMxYzEsIDB4MjczYTFkMWQsIDB4YjkyNzllOWUsIDB4MzhkOWUxZTEsIDB4MTNlYmY4ZjgsIDB4YjMyYjk4OTgsIDB4MzMyMjExMTEsIDB4YmJkMjY5NjksIDB4NzBhOWQ5ZDksIDB4ODkwNzhlOGUsIDB4YTczMzk0OTQsIDB4YjYyZDliOWIsIDB4MjIzYzFlMWUsIDB4OTIxNTg3ODcsIDB4MjBjOWU5ZTksIDB4NDk4N2NlY2UsIDB4ZmZhYTU1NTUsIDB4Nzg1MDI4MjgsIDB4N2FhNWRmZGYsIDB4OGYwMzhjOGMsIDB4Zjg1OWExYTEsIDB4ODAwOTg5ODksIDB4MTcxYTBkMGQsIDB4ZGE2NWJmYmYsIDB4MzFkN2U2ZTYsIDB4YzY4NDQyNDIsIDB4YjhkMDY4NjgsIDB4YzM4MjQxNDEsIDB4YjAyOTk5OTksIDB4Nzc1YTJkMmQsIDB4MTExZTBmMGYsIDB4Y2I3YmIwYjAsIDB4ZmNhODU0NTQsIDB4ZDY2ZGJiYmIsIDB4M2EyYzE2MTZdO1xuICAgIHZhciBUMyA9IFsweDYzYTVjNjYzLCAweDdjODRmODdjLCAweDc3OTllZTc3LCAweDdiOGRmNjdiLCAweGYyMGRmZmYyLCAweDZiYmRkNjZiLCAweDZmYjFkZTZmLCAweGM1NTQ5MWM1LCAweDMwNTA2MDMwLCAweDAxMDMwMjAxLCAweDY3YTljZTY3LCAweDJiN2Q1NjJiLCAweGZlMTllN2ZlLCAweGQ3NjJiNWQ3LCAweGFiZTY0ZGFiLCAweDc2OWFlYzc2LCAweGNhNDU4ZmNhLCAweDgyOWQxZjgyLCAweGM5NDA4OWM5LCAweDdkODdmYTdkLCAweGZhMTVlZmZhLCAweDU5ZWJiMjU5LCAweDQ3Yzk4ZTQ3LCAweGYwMGJmYmYwLCAweGFkZWM0MWFkLCAweGQ0NjdiM2Q0LCAweGEyZmQ1ZmEyLCAweGFmZWE0NWFmLCAweDljYmYyMzljLCAweGE0Zjc1M2E0LCAweDcyOTZlNDcyLCAweGMwNWI5YmMwLCAweGI3YzI3NWI3LCAweGZkMWNlMWZkLCAweDkzYWUzZDkzLCAweDI2NmE0YzI2LCAweDM2NWE2YzM2LCAweDNmNDE3ZTNmLCAweGY3MDJmNWY3LCAweGNjNGY4M2NjLCAweDM0NWM2ODM0LCAweGE1ZjQ1MWE1LCAweGU1MzRkMWU1LCAweGYxMDhmOWYxLCAweDcxOTNlMjcxLCAweGQ4NzNhYmQ4LCAweDMxNTM2MjMxLCAweDE1M2YyYTE1LCAweDA0MGMwODA0LCAweGM3NTI5NWM3LCAweDIzNjU0NjIzLCAweGMzNWU5ZGMzLCAweDE4MjgzMDE4LCAweDk2YTEzNzk2LCAweDA1MGYwYTA1LCAweDlhYjUyZjlhLCAweDA3MDkwZTA3LCAweDEyMzYyNDEyLCAweDgwOWIxYjgwLCAweGUyM2RkZmUyLCAweGViMjZjZGViLCAweDI3Njk0ZTI3LCAweGIyY2Q3ZmIyLCAweDc1OWZlYTc1LCAweDA5MWIxMjA5LCAweDgzOWUxZDgzLCAweDJjNzQ1ODJjLCAweDFhMmUzNDFhLCAweDFiMmQzNjFiLCAweDZlYjJkYzZlLCAweDVhZWViNDVhLCAweGEwZmI1YmEwLCAweDUyZjZhNDUyLCAweDNiNGQ3NjNiLCAweGQ2NjFiN2Q2LCAweGIzY2U3ZGIzLCAweDI5N2I1MjI5LCAweGUzM2VkZGUzLCAweDJmNzE1ZTJmLCAweDg0OTcxMzg0LCAweDUzZjVhNjUzLCAweGQxNjhiOWQxLCAweDAwMDAwMDAwLCAweGVkMmNjMWVkLCAweDIwNjA0MDIwLCAweGZjMWZlM2ZjLCAweGIxYzg3OWIxLCAweDViZWRiNjViLCAweDZhYmVkNDZhLCAweGNiNDY4ZGNiLCAweGJlZDk2N2JlLCAweDM5NGI3MjM5LCAweDRhZGU5NDRhLCAweDRjZDQ5ODRjLCAweDU4ZThiMDU4LCAweGNmNGE4NWNmLCAweGQwNmJiYmQwLCAweGVmMmFjNWVmLCAweGFhZTU0ZmFhLCAweGZiMTZlZGZiLCAweDQzYzU4NjQzLCAweDRkZDc5YTRkLCAweDMzNTU2NjMzLCAweDg1OTQxMTg1LCAweDQ1Y2Y4YTQ1LCAweGY5MTBlOWY5LCAweDAyMDYwNDAyLCAweDdmODFmZTdmLCAweDUwZjBhMDUwLCAweDNjNDQ3ODNjLCAweDlmYmEyNTlmLCAweGE4ZTM0YmE4LCAweDUxZjNhMjUxLCAweGEzZmU1ZGEzLCAweDQwYzA4MDQwLCAweDhmOGEwNThmLCAweDkyYWQzZjkyLCAweDlkYmMyMTlkLCAweDM4NDg3MDM4LCAweGY1MDRmMWY1LCAweGJjZGY2M2JjLCAweGI2YzE3N2I2LCAweGRhNzVhZmRhLCAweDIxNjM0MjIxLCAweDEwMzAyMDEwLCAweGZmMWFlNWZmLCAweGYzMGVmZGYzLCAweGQyNmRiZmQyLCAweGNkNGM4MWNkLCAweDBjMTQxODBjLCAweDEzMzUyNjEzLCAweGVjMmZjM2VjLCAweDVmZTFiZTVmLCAweDk3YTIzNTk3LCAweDQ0Y2M4ODQ0LCAweDE3MzkyZTE3LCAweGM0NTc5M2M0LCAweGE3ZjI1NWE3LCAweDdlODJmYzdlLCAweDNkNDc3YTNkLCAweDY0YWNjODY0LCAweDVkZTdiYTVkLCAweDE5MmIzMjE5LCAweDczOTVlNjczLCAweDYwYTBjMDYwLCAweDgxOTgxOTgxLCAweDRmZDE5ZTRmLCAweGRjN2ZhM2RjLCAweDIyNjY0NDIyLCAweDJhN2U1NDJhLCAweDkwYWIzYjkwLCAweDg4ODMwYjg4LCAweDQ2Y2E4YzQ2LCAweGVlMjljN2VlLCAweGI4ZDM2YmI4LCAweDE0M2MyODE0LCAweGRlNzlhN2RlLCAweDVlZTJiYzVlLCAweDBiMWQxNjBiLCAweGRiNzZhZGRiLCAweGUwM2JkYmUwLCAweDMyNTY2NDMyLCAweDNhNGU3NDNhLCAweDBhMWUxNDBhLCAweDQ5ZGI5MjQ5LCAweDA2MGEwYzA2LCAweDI0NmM0ODI0LCAweDVjZTRiODVjLCAweGMyNWQ5ZmMyLCAweGQzNmViZGQzLCAweGFjZWY0M2FjLCAweDYyYTZjNDYyLCAweDkxYTgzOTkxLCAweDk1YTQzMTk1LCAweGU0MzdkM2U0LCAweDc5OGJmMjc5LCAweGU3MzJkNWU3LCAweGM4NDM4YmM4LCAweDM3NTk2ZTM3LCAweDZkYjdkYTZkLCAweDhkOGMwMThkLCAweGQ1NjRiMWQ1LCAweDRlZDI5YzRlLCAweGE5ZTA0OWE5LCAweDZjYjRkODZjLCAweDU2ZmFhYzU2LCAweGY0MDdmM2Y0LCAweGVhMjVjZmVhLCAweDY1YWZjYTY1LCAweDdhOGVmNDdhLCAweGFlZTk0N2FlLCAweDA4MTgxMDA4LCAweGJhZDU2ZmJhLCAweDc4ODhmMDc4LCAweDI1NmY0YTI1LCAweDJlNzI1YzJlLCAweDFjMjQzODFjLCAweGE2ZjE1N2E2LCAweGI0Yzc3M2I0LCAweGM2NTE5N2M2LCAweGU4MjNjYmU4LCAweGRkN2NhMWRkLCAweDc0OWNlODc0LCAweDFmMjEzZTFmLCAweDRiZGQ5NjRiLCAweGJkZGM2MWJkLCAweDhiODYwZDhiLCAweDhhODUwZjhhLCAweDcwOTBlMDcwLCAweDNlNDI3YzNlLCAweGI1YzQ3MWI1LCAweDY2YWFjYzY2LCAweDQ4ZDg5MDQ4LCAweDAzMDUwNjAzLCAweGY2MDFmN2Y2LCAweDBlMTIxYzBlLCAweDYxYTNjMjYxLCAweDM1NWY2YTM1LCAweDU3ZjlhZTU3LCAweGI5ZDA2OWI5LCAweDg2OTExNzg2LCAweGMxNTg5OWMxLCAweDFkMjczYTFkLCAweDllYjkyNzllLCAweGUxMzhkOWUxLCAweGY4MTNlYmY4LCAweDk4YjMyYjk4LCAweDExMzMyMjExLCAweDY5YmJkMjY5LCAweGQ5NzBhOWQ5LCAweDhlODkwNzhlLCAweDk0YTczMzk0LCAweDliYjYyZDliLCAweDFlMjIzYzFlLCAweDg3OTIxNTg3LCAweGU5MjBjOWU5LCAweGNlNDk4N2NlLCAweDU1ZmZhYTU1LCAweDI4Nzg1MDI4LCAweGRmN2FhNWRmLCAweDhjOGYwMzhjLCAweGExZjg1OWExLCAweDg5ODAwOTg5LCAweDBkMTcxYTBkLCAweGJmZGE2NWJmLCAweGU2MzFkN2U2LCAweDQyYzY4NDQyLCAweDY4YjhkMDY4LCAweDQxYzM4MjQxLCAweDk5YjAyOTk5LCAweDJkNzc1YTJkLCAweDBmMTExZTBmLCAweGIwY2I3YmIwLCAweDU0ZmNhODU0LCAweGJiZDY2ZGJiLCAweDE2M2EyYzE2XTtcbiAgICB2YXIgVDQgPSBbMHg2MzYzYTVjNiwgMHg3YzdjODRmOCwgMHg3Nzc3OTllZSwgMHg3YjdiOGRmNiwgMHhmMmYyMGRmZiwgMHg2YjZiYmRkNiwgMHg2ZjZmYjFkZSwgMHhjNWM1NTQ5MSwgMHgzMDMwNTA2MCwgMHgwMTAxMDMwMiwgMHg2NzY3YTljZSwgMHgyYjJiN2Q1NiwgMHhmZWZlMTllNywgMHhkN2Q3NjJiNSwgMHhhYmFiZTY0ZCwgMHg3Njc2OWFlYywgMHhjYWNhNDU4ZiwgMHg4MjgyOWQxZiwgMHhjOWM5NDA4OSwgMHg3ZDdkODdmYSwgMHhmYWZhMTVlZiwgMHg1OTU5ZWJiMiwgMHg0NzQ3Yzk4ZSwgMHhmMGYwMGJmYiwgMHhhZGFkZWM0MSwgMHhkNGQ0NjdiMywgMHhhMmEyZmQ1ZiwgMHhhZmFmZWE0NSwgMHg5YzljYmYyMywgMHhhNGE0Zjc1MywgMHg3MjcyOTZlNCwgMHhjMGMwNWI5YiwgMHhiN2I3YzI3NSwgMHhmZGZkMWNlMSwgMHg5MzkzYWUzZCwgMHgyNjI2NmE0YywgMHgzNjM2NWE2YywgMHgzZjNmNDE3ZSwgMHhmN2Y3MDJmNSwgMHhjY2NjNGY4MywgMHgzNDM0NWM2OCwgMHhhNWE1ZjQ1MSwgMHhlNWU1MzRkMSwgMHhmMWYxMDhmOSwgMHg3MTcxOTNlMiwgMHhkOGQ4NzNhYiwgMHgzMTMxNTM2MiwgMHgxNTE1M2YyYSwgMHgwNDA0MGMwOCwgMHhjN2M3NTI5NSwgMHgyMzIzNjU0NiwgMHhjM2MzNWU5ZCwgMHgxODE4MjgzMCwgMHg5Njk2YTEzNywgMHgwNTA1MGYwYSwgMHg5YTlhYjUyZiwgMHgwNzA3MDkwZSwgMHgxMjEyMzYyNCwgMHg4MDgwOWIxYiwgMHhlMmUyM2RkZiwgMHhlYmViMjZjZCwgMHgyNzI3Njk0ZSwgMHhiMmIyY2Q3ZiwgMHg3NTc1OWZlYSwgMHgwOTA5MWIxMiwgMHg4MzgzOWUxZCwgMHgyYzJjNzQ1OCwgMHgxYTFhMmUzNCwgMHgxYjFiMmQzNiwgMHg2ZTZlYjJkYywgMHg1YTVhZWViNCwgMHhhMGEwZmI1YiwgMHg1MjUyZjZhNCwgMHgzYjNiNGQ3NiwgMHhkNmQ2NjFiNywgMHhiM2IzY2U3ZCwgMHgyOTI5N2I1MiwgMHhlM2UzM2VkZCwgMHgyZjJmNzE1ZSwgMHg4NDg0OTcxMywgMHg1MzUzZjVhNiwgMHhkMWQxNjhiOSwgMHgwMDAwMDAwMCwgMHhlZGVkMmNjMSwgMHgyMDIwNjA0MCwgMHhmY2ZjMWZlMywgMHhiMWIxYzg3OSwgMHg1YjViZWRiNiwgMHg2YTZhYmVkNCwgMHhjYmNiNDY4ZCwgMHhiZWJlZDk2NywgMHgzOTM5NGI3MiwgMHg0YTRhZGU5NCwgMHg0YzRjZDQ5OCwgMHg1ODU4ZThiMCwgMHhjZmNmNGE4NSwgMHhkMGQwNmJiYiwgMHhlZmVmMmFjNSwgMHhhYWFhZTU0ZiwgMHhmYmZiMTZlZCwgMHg0MzQzYzU4NiwgMHg0ZDRkZDc5YSwgMHgzMzMzNTU2NiwgMHg4NTg1OTQxMSwgMHg0NTQ1Y2Y4YSwgMHhmOWY5MTBlOSwgMHgwMjAyMDYwNCwgMHg3ZjdmODFmZSwgMHg1MDUwZjBhMCwgMHgzYzNjNDQ3OCwgMHg5ZjlmYmEyNSwgMHhhOGE4ZTM0YiwgMHg1MTUxZjNhMiwgMHhhM2EzZmU1ZCwgMHg0MDQwYzA4MCwgMHg4ZjhmOGEwNSwgMHg5MjkyYWQzZiwgMHg5ZDlkYmMyMSwgMHgzODM4NDg3MCwgMHhmNWY1MDRmMSwgMHhiY2JjZGY2MywgMHhiNmI2YzE3NywgMHhkYWRhNzVhZiwgMHgyMTIxNjM0MiwgMHgxMDEwMzAyMCwgMHhmZmZmMWFlNSwgMHhmM2YzMGVmZCwgMHhkMmQyNmRiZiwgMHhjZGNkNGM4MSwgMHgwYzBjMTQxOCwgMHgxMzEzMzUyNiwgMHhlY2VjMmZjMywgMHg1ZjVmZTFiZSwgMHg5Nzk3YTIzNSwgMHg0NDQ0Y2M4OCwgMHgxNzE3MzkyZSwgMHhjNGM0NTc5MywgMHhhN2E3ZjI1NSwgMHg3ZTdlODJmYywgMHgzZDNkNDc3YSwgMHg2NDY0YWNjOCwgMHg1ZDVkZTdiYSwgMHgxOTE5MmIzMiwgMHg3MzczOTVlNiwgMHg2MDYwYTBjMCwgMHg4MTgxOTgxOSwgMHg0ZjRmZDE5ZSwgMHhkY2RjN2ZhMywgMHgyMjIyNjY0NCwgMHgyYTJhN2U1NCwgMHg5MDkwYWIzYiwgMHg4ODg4ODMwYiwgMHg0NjQ2Y2E4YywgMHhlZWVlMjljNywgMHhiOGI4ZDM2YiwgMHgxNDE0M2MyOCwgMHhkZWRlNzlhNywgMHg1ZTVlZTJiYywgMHgwYjBiMWQxNiwgMHhkYmRiNzZhZCwgMHhlMGUwM2JkYiwgMHgzMjMyNTY2NCwgMHgzYTNhNGU3NCwgMHgwYTBhMWUxNCwgMHg0OTQ5ZGI5MiwgMHgwNjA2MGEwYywgMHgyNDI0NmM0OCwgMHg1YzVjZTRiOCwgMHhjMmMyNWQ5ZiwgMHhkM2QzNmViZCwgMHhhY2FjZWY0MywgMHg2MjYyYTZjNCwgMHg5MTkxYTgzOSwgMHg5NTk1YTQzMSwgMHhlNGU0MzdkMywgMHg3OTc5OGJmMiwgMHhlN2U3MzJkNSwgMHhjOGM4NDM4YiwgMHgzNzM3NTk2ZSwgMHg2ZDZkYjdkYSwgMHg4ZDhkOGMwMSwgMHhkNWQ1NjRiMSwgMHg0ZTRlZDI5YywgMHhhOWE5ZTA0OSwgMHg2YzZjYjRkOCwgMHg1NjU2ZmFhYywgMHhmNGY0MDdmMywgMHhlYWVhMjVjZiwgMHg2NTY1YWZjYSwgMHg3YTdhOGVmNCwgMHhhZWFlZTk0NywgMHgwODA4MTgxMCwgMHhiYWJhZDU2ZiwgMHg3ODc4ODhmMCwgMHgyNTI1NmY0YSwgMHgyZTJlNzI1YywgMHgxYzFjMjQzOCwgMHhhNmE2ZjE1NywgMHhiNGI0Yzc3MywgMHhjNmM2NTE5NywgMHhlOGU4MjNjYiwgMHhkZGRkN2NhMSwgMHg3NDc0OWNlOCwgMHgxZjFmMjEzZSwgMHg0YjRiZGQ5NiwgMHhiZGJkZGM2MSwgMHg4YjhiODYwZCwgMHg4YThhODUwZiwgMHg3MDcwOTBlMCwgMHgzZTNlNDI3YywgMHhiNWI1YzQ3MSwgMHg2NjY2YWFjYywgMHg0ODQ4ZDg5MCwgMHgwMzAzMDUwNiwgMHhmNmY2MDFmNywgMHgwZTBlMTIxYywgMHg2MTYxYTNjMiwgMHgzNTM1NWY2YSwgMHg1NzU3ZjlhZSwgMHhiOWI5ZDA2OSwgMHg4Njg2OTExNywgMHhjMWMxNTg5OSwgMHgxZDFkMjczYSwgMHg5ZTllYjkyNywgMHhlMWUxMzhkOSwgMHhmOGY4MTNlYiwgMHg5ODk4YjMyYiwgMHgxMTExMzMyMiwgMHg2OTY5YmJkMiwgMHhkOWQ5NzBhOSwgMHg4ZThlODkwNywgMHg5NDk0YTczMywgMHg5YjliYjYyZCwgMHgxZTFlMjIzYywgMHg4Nzg3OTIxNSwgMHhlOWU5MjBjOSwgMHhjZWNlNDk4NywgMHg1NTU1ZmZhYSwgMHgyODI4Nzg1MCwgMHhkZmRmN2FhNSwgMHg4YzhjOGYwMywgMHhhMWExZjg1OSwgMHg4OTg5ODAwOSwgMHgwZDBkMTcxYSwgMHhiZmJmZGE2NSwgMHhlNmU2MzFkNywgMHg0MjQyYzY4NCwgMHg2ODY4YjhkMCwgMHg0MTQxYzM4MiwgMHg5OTk5YjAyOSwgMHgyZDJkNzc1YSwgMHgwZjBmMTExZSwgMHhiMGIwY2I3YiwgMHg1NDU0ZmNhOCwgMHhiYmJiZDY2ZCwgMHgxNjE2M2EyY107XG5cbiAgICAvLyBUcmFuc2Zvcm1hdGlvbnMgZm9yIGRlY3J5cHRpb25cbiAgICB2YXIgVDUgPSBbMHg1MWY0YTc1MCwgMHg3ZTQxNjU1MywgMHgxYTE3YTRjMywgMHgzYTI3NWU5NiwgMHgzYmFiNmJjYiwgMHgxZjlkNDVmMSwgMHhhY2ZhNThhYiwgMHg0YmUzMDM5MywgMHgyMDMwZmE1NSwgMHhhZDc2NmRmNiwgMHg4OGNjNzY5MSwgMHhmNTAyNGMyNSwgMHg0ZmU1ZDdmYywgMHhjNTJhY2JkNywgMHgyNjM1NDQ4MCwgMHhiNTYyYTM4ZiwgMHhkZWIxNWE0OSwgMHgyNWJhMWI2NywgMHg0NWVhMGU5OCwgMHg1ZGZlYzBlMSwgMHhjMzJmNzUwMiwgMHg4MTRjZjAxMiwgMHg4ZDQ2OTdhMywgMHg2YmQzZjljNiwgMHgwMzhmNWZlNywgMHgxNTkyOWM5NSwgMHhiZjZkN2FlYiwgMHg5NTUyNTlkYSwgMHhkNGJlODMyZCwgMHg1ODc0MjFkMywgMHg0OWUwNjkyOSwgMHg4ZWM5Yzg0NCwgMHg3NWMyODk2YSwgMHhmNDhlNzk3OCwgMHg5OTU4M2U2YiwgMHgyN2I5NzFkZCwgMHhiZWUxNGZiNiwgMHhmMDg4YWQxNywgMHhjOTIwYWM2NiwgMHg3ZGNlM2FiNCwgMHg2M2RmNGExOCwgMHhlNTFhMzE4MiwgMHg5NzUxMzM2MCwgMHg2MjUzN2Y0NSwgMHhiMTY0NzdlMCwgMHhiYjZiYWU4NCwgMHhmZTgxYTAxYywgMHhmOTA4MmI5NCwgMHg3MDQ4Njg1OCwgMHg4ZjQ1ZmQxOSwgMHg5NGRlNmM4NywgMHg1MjdiZjhiNywgMHhhYjczZDMyMywgMHg3MjRiMDJlMiwgMHhlMzFmOGY1NywgMHg2NjU1YWIyYSwgMHhiMmViMjgwNywgMHgyZmI1YzIwMywgMHg4NmM1N2I5YSwgMHhkMzM3MDhhNSwgMHgzMDI4ODdmMiwgMHgyM2JmYTViMiwgMHgwMjAzNmFiYSwgMHhlZDE2ODI1YywgMHg4YWNmMWMyYiwgMHhhNzc5YjQ5MiwgMHhmMzA3ZjJmMCwgMHg0ZTY5ZTJhMSwgMHg2NWRhZjRjZCwgMHgwNjA1YmVkNSwgMHhkMTM0NjIxZiwgMHhjNGE2ZmU4YSwgMHgzNDJlNTM5ZCwgMHhhMmYzNTVhMCwgMHgwNThhZTEzMiwgMHhhNGY2ZWI3NSwgMHgwYjgzZWMzOSwgMHg0MDYwZWZhYSwgMHg1ZTcxOWYwNiwgMHhiZDZlMTA1MSwgMHgzZTIxOGFmOSwgMHg5NmRkMDYzZCwgMHhkZDNlMDVhZSwgMHg0ZGU2YmQ0NiwgMHg5MTU0OGRiNSwgMHg3MWM0NWQwNSwgMHgwNDA2ZDQ2ZiwgMHg2MDUwMTVmZiwgMHgxOTk4ZmIyNCwgMHhkNmJkZTk5NywgMHg4OTQwNDNjYywgMHg2N2Q5OWU3NywgMHhiMGU4NDJiZCwgMHgwNzg5OGI4OCwgMHhlNzE5NWIzOCwgMHg3OWM4ZWVkYiwgMHhhMTdjMGE0NywgMHg3YzQyMGZlOSwgMHhmODg0MWVjOSwgMHgwMDAwMDAwMCwgMHgwOTgwODY4MywgMHgzMjJiZWQ0OCwgMHgxZTExNzBhYywgMHg2YzVhNzI0ZSwgMHhmZDBlZmZmYiwgMHgwZjg1Mzg1NiwgMHgzZGFlZDUxZSwgMHgzNjJkMzkyNywgMHgwYTBmZDk2NCwgMHg2ODVjYTYyMSwgMHg5YjViNTRkMSwgMHgyNDM2MmUzYSwgMHgwYzBhNjdiMSwgMHg5MzU3ZTcwZiwgMHhiNGVlOTZkMiwgMHgxYjliOTE5ZSwgMHg4MGMwYzU0ZiwgMHg2MWRjMjBhMiwgMHg1YTc3NGI2OSwgMHgxYzEyMWExNiwgMHhlMjkzYmEwYSwgMHhjMGEwMmFlNSwgMHgzYzIyZTA0MywgMHgxMjFiMTcxZCwgMHgwZTA5MGQwYiwgMHhmMjhiYzdhZCwgMHgyZGI2YThiOSwgMHgxNDFlYTljOCwgMHg1N2YxMTk4NSwgMHhhZjc1MDc0YywgMHhlZTk5ZGRiYiwgMHhhMzdmNjBmZCwgMHhmNzAxMjY5ZiwgMHg1YzcyZjViYywgMHg0NDY2M2JjNSwgMHg1YmZiN2UzNCwgMHg4YjQzMjk3NiwgMHhjYjIzYzZkYywgMHhiNmVkZmM2OCwgMHhiOGU0ZjE2MywgMHhkNzMxZGNjYSwgMHg0MjYzODUxMCwgMHgxMzk3MjI0MCwgMHg4NGM2MTEyMCwgMHg4NTRhMjQ3ZCwgMHhkMmJiM2RmOCwgMHhhZWY5MzIxMSwgMHhjNzI5YTE2ZCwgMHgxZDllMmY0YiwgMHhkY2IyMzBmMywgMHgwZDg2NTJlYywgMHg3N2MxZTNkMCwgMHgyYmIzMTY2YywgMHhhOTcwYjk5OSwgMHgxMTk0NDhmYSwgMHg0N2U5NjQyMiwgMHhhOGZjOGNjNCwgMHhhMGYwM2YxYSwgMHg1NjdkMmNkOCwgMHgyMjMzOTBlZiwgMHg4NzQ5NGVjNywgMHhkOTM4ZDFjMSwgMHg4Y2NhYTJmZSwgMHg5OGQ0MGIzNiwgMHhhNmY1ODFjZiwgMHhhNTdhZGUyOCwgMHhkYWI3OGUyNiwgMHgzZmFkYmZhNCwgMHgyYzNhOWRlNCwgMHg1MDc4OTIwZCwgMHg2YTVmY2M5YiwgMHg1NDdlNDY2MiwgMHhmNjhkMTNjMiwgMHg5MGQ4YjhlOCwgMHgyZTM5Zjc1ZSwgMHg4MmMzYWZmNSwgMHg5ZjVkODBiZSwgMHg2OWQwOTM3YywgMHg2ZmQ1MmRhOSwgMHhjZjI1MTJiMywgMHhjOGFjOTkzYiwgMHgxMDE4N2RhNywgMHhlODljNjM2ZSwgMHhkYjNiYmI3YiwgMHhjZDI2NzgwOSwgMHg2ZTU5MThmNCwgMHhlYzlhYjcwMSwgMHg4MzRmOWFhOCwgMHhlNjk1NmU2NSwgMHhhYWZmZTY3ZSwgMHgyMWJjY2YwOCwgMHhlZjE1ZThlNiwgMHhiYWU3OWJkOSwgMHg0YTZmMzZjZSwgMHhlYTlmMDlkNCwgMHgyOWIwN2NkNiwgMHgzMWE0YjJhZiwgMHgyYTNmMjMzMSwgMHhjNmE1OTQzMCwgMHgzNWEyNjZjMCwgMHg3NDRlYmMzNywgMHhmYzgyY2FhNiwgMHhlMDkwZDBiMCwgMHgzM2E3ZDgxNSwgMHhmMTA0OTg0YSwgMHg0MWVjZGFmNywgMHg3ZmNkNTAwZSwgMHgxNzkxZjYyZiwgMHg3NjRkZDY4ZCwgMHg0M2VmYjA0ZCwgMHhjY2FhNGQ1NCwgMHhlNDk2MDRkZiwgMHg5ZWQxYjVlMywgMHg0YzZhODgxYiwgMHhjMTJjMWZiOCwgMHg0NjY1NTE3ZiwgMHg5ZDVlZWEwNCwgMHgwMThjMzU1ZCwgMHhmYTg3NzQ3MywgMHhmYjBiNDEyZSwgMHhiMzY3MWQ1YSwgMHg5MmRiZDI1MiwgMHhlOTEwNTYzMywgMHg2ZGQ2NDcxMywgMHg5YWQ3NjE4YywgMHgzN2ExMGM3YSwgMHg1OWY4MTQ4ZSwgMHhlYjEzM2M4OSwgMHhjZWE5MjdlZSwgMHhiNzYxYzkzNSwgMHhlMTFjZTVlZCwgMHg3YTQ3YjEzYywgMHg5Y2QyZGY1OSwgMHg1NWYyNzMzZiwgMHgxODE0Y2U3OSwgMHg3M2M3MzdiZiwgMHg1M2Y3Y2RlYSwgMHg1ZmZkYWE1YiwgMHhkZjNkNmYxNCwgMHg3ODQ0ZGI4NiwgMHhjYWFmZjM4MSwgMHhiOTY4YzQzZSwgMHgzODI0MzQyYywgMHhjMmEzNDA1ZiwgMHgxNjFkYzM3MiwgMHhiY2UyMjUwYywgMHgyODNjNDk4YiwgMHhmZjBkOTU0MSwgMHgzOWE4MDE3MSwgMHgwODBjYjNkZSwgMHhkOGI0ZTQ5YywgMHg2NDU2YzE5MCwgMHg3YmNiODQ2MSwgMHhkNTMyYjY3MCwgMHg0ODZjNWM3NCwgMHhkMGI4NTc0Ml07XG4gICAgdmFyIFQ2ID0gWzB4NTA1MWY0YTcsIDB4NTM3ZTQxNjUsIDB4YzMxYTE3YTQsIDB4OTYzYTI3NWUsIDB4Y2IzYmFiNmIsIDB4ZjExZjlkNDUsIDB4YWJhY2ZhNTgsIDB4OTM0YmUzMDMsIDB4NTUyMDMwZmEsIDB4ZjZhZDc2NmQsIDB4OTE4OGNjNzYsIDB4MjVmNTAyNGMsIDB4ZmM0ZmU1ZDcsIDB4ZDdjNTJhY2IsIDB4ODAyNjM1NDQsIDB4OGZiNTYyYTMsIDB4NDlkZWIxNWEsIDB4NjcyNWJhMWIsIDB4OTg0NWVhMGUsIDB4ZTE1ZGZlYzAsIDB4MDJjMzJmNzUsIDB4MTI4MTRjZjAsIDB4YTM4ZDQ2OTcsIDB4YzY2YmQzZjksIDB4ZTcwMzhmNWYsIDB4OTUxNTkyOWMsIDB4ZWJiZjZkN2EsIDB4ZGE5NTUyNTksIDB4MmRkNGJlODMsIDB4ZDM1ODc0MjEsIDB4Mjk0OWUwNjksIDB4NDQ4ZWM5YzgsIDB4NmE3NWMyODksIDB4NzhmNDhlNzksIDB4NmI5OTU4M2UsIDB4ZGQyN2I5NzEsIDB4YjZiZWUxNGYsIDB4MTdmMDg4YWQsIDB4NjZjOTIwYWMsIDB4YjQ3ZGNlM2EsIDB4MTg2M2RmNGEsIDB4ODJlNTFhMzEsIDB4NjA5NzUxMzMsIDB4NDU2MjUzN2YsIDB4ZTBiMTY0NzcsIDB4ODRiYjZiYWUsIDB4MWNmZTgxYTAsIDB4OTRmOTA4MmIsIDB4NTg3MDQ4NjgsIDB4MTk4ZjQ1ZmQsIDB4ODc5NGRlNmMsIDB4Yjc1MjdiZjgsIDB4MjNhYjczZDMsIDB4ZTI3MjRiMDIsIDB4NTdlMzFmOGYsIDB4MmE2NjU1YWIsIDB4MDdiMmViMjgsIDB4MDMyZmI1YzIsIDB4OWE4NmM1N2IsIDB4YTVkMzM3MDgsIDB4ZjIzMDI4ODcsIDB4YjIyM2JmYTUsIDB4YmEwMjAzNmEsIDB4NWNlZDE2ODIsIDB4MmI4YWNmMWMsIDB4OTJhNzc5YjQsIDB4ZjBmMzA3ZjIsIDB4YTE0ZTY5ZTIsIDB4Y2Q2NWRhZjQsIDB4ZDUwNjA1YmUsIDB4MWZkMTM0NjIsIDB4OGFjNGE2ZmUsIDB4OWQzNDJlNTMsIDB4YTBhMmYzNTUsIDB4MzIwNThhZTEsIDB4NzVhNGY2ZWIsIDB4MzkwYjgzZWMsIDB4YWE0MDYwZWYsIDB4MDY1ZTcxOWYsIDB4NTFiZDZlMTAsIDB4ZjkzZTIxOGEsIDB4M2Q5NmRkMDYsIDB4YWVkZDNlMDUsIDB4NDY0ZGU2YmQsIDB4YjU5MTU0OGQsIDB4MDU3MWM0NWQsIDB4NmYwNDA2ZDQsIDB4ZmY2MDUwMTUsIDB4MjQxOTk4ZmIsIDB4OTdkNmJkZTksIDB4Y2M4OTQwNDMsIDB4Nzc2N2Q5OWUsIDB4YmRiMGU4NDIsIDB4ODgwNzg5OGIsIDB4MzhlNzE5NWIsIDB4ZGI3OWM4ZWUsIDB4NDdhMTdjMGEsIDB4ZTk3YzQyMGYsIDB4YzlmODg0MWUsIDB4MDAwMDAwMDAsIDB4ODMwOTgwODYsIDB4NDgzMjJiZWQsIDB4YWMxZTExNzAsIDB4NGU2YzVhNzIsIDB4ZmJmZDBlZmYsIDB4NTYwZjg1MzgsIDB4MWUzZGFlZDUsIDB4MjczNjJkMzksIDB4NjQwYTBmZDksIDB4MjE2ODVjYTYsIDB4ZDE5YjViNTQsIDB4M2EyNDM2MmUsIDB4YjEwYzBhNjcsIDB4MGY5MzU3ZTcsIDB4ZDJiNGVlOTYsIDB4OWUxYjliOTEsIDB4NGY4MGMwYzUsIDB4YTI2MWRjMjAsIDB4Njk1YTc3NGIsIDB4MTYxYzEyMWEsIDB4MGFlMjkzYmEsIDB4ZTVjMGEwMmEsIDB4NDMzYzIyZTAsIDB4MWQxMjFiMTcsIDB4MGIwZTA5MGQsIDB4YWRmMjhiYzcsIDB4YjkyZGI2YTgsIDB4YzgxNDFlYTksIDB4ODU1N2YxMTksIDB4NGNhZjc1MDcsIDB4YmJlZTk5ZGQsIDB4ZmRhMzdmNjAsIDB4OWZmNzAxMjYsIDB4YmM1YzcyZjUsIDB4YzU0NDY2M2IsIDB4MzQ1YmZiN2UsIDB4NzY4YjQzMjksIDB4ZGNjYjIzYzYsIDB4NjhiNmVkZmMsIDB4NjNiOGU0ZjEsIDB4Y2FkNzMxZGMsIDB4MTA0MjYzODUsIDB4NDAxMzk3MjIsIDB4MjA4NGM2MTEsIDB4N2Q4NTRhMjQsIDB4ZjhkMmJiM2QsIDB4MTFhZWY5MzIsIDB4NmRjNzI5YTEsIDB4NGIxZDllMmYsIDB4ZjNkY2IyMzAsIDB4ZWMwZDg2NTIsIDB4ZDA3N2MxZTMsIDB4NmMyYmIzMTYsIDB4OTlhOTcwYjksIDB4ZmExMTk0NDgsIDB4MjI0N2U5NjQsIDB4YzRhOGZjOGMsIDB4MWFhMGYwM2YsIDB4ZDg1NjdkMmMsIDB4ZWYyMjMzOTAsIDB4Yzc4NzQ5NGUsIDB4YzFkOTM4ZDEsIDB4ZmU4Y2NhYTIsIDB4MzY5OGQ0MGIsIDB4Y2ZhNmY1ODEsIDB4MjhhNTdhZGUsIDB4MjZkYWI3OGUsIDB4YTQzZmFkYmYsIDB4ZTQyYzNhOWQsIDB4MGQ1MDc4OTIsIDB4OWI2YTVmY2MsIDB4NjI1NDdlNDYsIDB4YzJmNjhkMTMsIDB4ZTg5MGQ4YjgsIDB4NWUyZTM5ZjcsIDB4ZjU4MmMzYWYsIDB4YmU5ZjVkODAsIDB4N2M2OWQwOTMsIDB4YTk2ZmQ1MmQsIDB4YjNjZjI1MTIsIDB4M2JjOGFjOTksIDB4YTcxMDE4N2QsIDB4NmVlODljNjMsIDB4N2JkYjNiYmIsIDB4MDljZDI2NzgsIDB4ZjQ2ZTU5MTgsIDB4MDFlYzlhYjcsIDB4YTg4MzRmOWEsIDB4NjVlNjk1NmUsIDB4N2VhYWZmZTYsIDB4MDgyMWJjY2YsIDB4ZTZlZjE1ZTgsIDB4ZDliYWU3OWIsIDB4Y2U0YTZmMzYsIDB4ZDRlYTlmMDksIDB4ZDYyOWIwN2MsIDB4YWYzMWE0YjIsIDB4MzEyYTNmMjMsIDB4MzBjNmE1OTQsIDB4YzAzNWEyNjYsIDB4Mzc3NDRlYmMsIDB4YTZmYzgyY2EsIDB4YjBlMDkwZDAsIDB4MTUzM2E3ZDgsIDB4NGFmMTA0OTgsIDB4Zjc0MWVjZGEsIDB4MGU3ZmNkNTAsIDB4MmYxNzkxZjYsIDB4OGQ3NjRkZDYsIDB4NGQ0M2VmYjAsIDB4NTRjY2FhNGQsIDB4ZGZlNDk2MDQsIDB4ZTM5ZWQxYjUsIDB4MWI0YzZhODgsIDB4YjhjMTJjMWYsIDB4N2Y0NjY1NTEsIDB4MDQ5ZDVlZWEsIDB4NWQwMThjMzUsIDB4NzNmYTg3NzQsIDB4MmVmYjBiNDEsIDB4NWFiMzY3MWQsIDB4NTI5MmRiZDIsIDB4MzNlOTEwNTYsIDB4MTM2ZGQ2NDcsIDB4OGM5YWQ3NjEsIDB4N2EzN2ExMGMsIDB4OGU1OWY4MTQsIDB4ODllYjEzM2MsIDB4ZWVjZWE5MjcsIDB4MzViNzYxYzksIDB4ZWRlMTFjZTUsIDB4M2M3YTQ3YjEsIDB4NTk5Y2QyZGYsIDB4M2Y1NWYyNzMsIDB4NzkxODE0Y2UsIDB4YmY3M2M3MzcsIDB4ZWE1M2Y3Y2QsIDB4NWI1ZmZkYWEsIDB4MTRkZjNkNmYsIDB4ODY3ODQ0ZGIsIDB4ODFjYWFmZjMsIDB4M2ViOTY4YzQsIDB4MmMzODI0MzQsIDB4NWZjMmEzNDAsIDB4NzIxNjFkYzMsIDB4MGNiY2UyMjUsIDB4OGIyODNjNDksIDB4NDFmZjBkOTUsIDB4NzEzOWE4MDEsIDB4ZGUwODBjYjMsIDB4OWNkOGI0ZTQsIDB4OTA2NDU2YzEsIDB4NjE3YmNiODQsIDB4NzBkNTMyYjYsIDB4NzQ0ODZjNWMsIDB4NDJkMGI4NTddO1xuICAgIHZhciBUNyA9IFsweGE3NTA1MWY0LCAweDY1NTM3ZTQxLCAweGE0YzMxYTE3LCAweDVlOTYzYTI3LCAweDZiY2IzYmFiLCAweDQ1ZjExZjlkLCAweDU4YWJhY2ZhLCAweDAzOTM0YmUzLCAweGZhNTUyMDMwLCAweDZkZjZhZDc2LCAweDc2OTE4OGNjLCAweDRjMjVmNTAyLCAweGQ3ZmM0ZmU1LCAweGNiZDdjNTJhLCAweDQ0ODAyNjM1LCAweGEzOGZiNTYyLCAweDVhNDlkZWIxLCAweDFiNjcyNWJhLCAweDBlOTg0NWVhLCAweGMwZTE1ZGZlLCAweDc1MDJjMzJmLCAweGYwMTI4MTRjLCAweDk3YTM4ZDQ2LCAweGY5YzY2YmQzLCAweDVmZTcwMzhmLCAweDljOTUxNTkyLCAweDdhZWJiZjZkLCAweDU5ZGE5NTUyLCAweDgzMmRkNGJlLCAweDIxZDM1ODc0LCAweDY5Mjk0OWUwLCAweGM4NDQ4ZWM5LCAweDg5NmE3NWMyLCAweDc5NzhmNDhlLCAweDNlNmI5OTU4LCAweDcxZGQyN2I5LCAweDRmYjZiZWUxLCAweGFkMTdmMDg4LCAweGFjNjZjOTIwLCAweDNhYjQ3ZGNlLCAweDRhMTg2M2RmLCAweDMxODJlNTFhLCAweDMzNjA5NzUxLCAweDdmNDU2MjUzLCAweDc3ZTBiMTY0LCAweGFlODRiYjZiLCAweGEwMWNmZTgxLCAweDJiOTRmOTA4LCAweDY4NTg3MDQ4LCAweGZkMTk4ZjQ1LCAweDZjODc5NGRlLCAweGY4Yjc1MjdiLCAweGQzMjNhYjczLCAweDAyZTI3MjRiLCAweDhmNTdlMzFmLCAweGFiMmE2NjU1LCAweDI4MDdiMmViLCAweGMyMDMyZmI1LCAweDdiOWE4NmM1LCAweDA4YTVkMzM3LCAweDg3ZjIzMDI4LCAweGE1YjIyM2JmLCAweDZhYmEwMjAzLCAweDgyNWNlZDE2LCAweDFjMmI4YWNmLCAweGI0OTJhNzc5LCAweGYyZjBmMzA3LCAweGUyYTE0ZTY5LCAweGY0Y2Q2NWRhLCAweGJlZDUwNjA1LCAweDYyMWZkMTM0LCAweGZlOGFjNGE2LCAweDUzOWQzNDJlLCAweDU1YTBhMmYzLCAweGUxMzIwNThhLCAweGViNzVhNGY2LCAweGVjMzkwYjgzLCAweGVmYWE0MDYwLCAweDlmMDY1ZTcxLCAweDEwNTFiZDZlLCAweDhhZjkzZTIxLCAweDA2M2Q5NmRkLCAweDA1YWVkZDNlLCAweGJkNDY0ZGU2LCAweDhkYjU5MTU0LCAweDVkMDU3MWM0LCAweGQ0NmYwNDA2LCAweDE1ZmY2MDUwLCAweGZiMjQxOTk4LCAweGU5OTdkNmJkLCAweDQzY2M4OTQwLCAweDllNzc2N2Q5LCAweDQyYmRiMGU4LCAweDhiODgwNzg5LCAweDViMzhlNzE5LCAweGVlZGI3OWM4LCAweDBhNDdhMTdjLCAweDBmZTk3YzQyLCAweDFlYzlmODg0LCAweDAwMDAwMDAwLCAweDg2ODMwOTgwLCAweGVkNDgzMjJiLCAweDcwYWMxZTExLCAweDcyNGU2YzVhLCAweGZmZmJmZDBlLCAweDM4NTYwZjg1LCAweGQ1MWUzZGFlLCAweDM5MjczNjJkLCAweGQ5NjQwYTBmLCAweGE2MjE2ODVjLCAweDU0ZDE5YjViLCAweDJlM2EyNDM2LCAweDY3YjEwYzBhLCAweGU3MGY5MzU3LCAweDk2ZDJiNGVlLCAweDkxOWUxYjliLCAweGM1NGY4MGMwLCAweDIwYTI2MWRjLCAweDRiNjk1YTc3LCAweDFhMTYxYzEyLCAweGJhMGFlMjkzLCAweDJhZTVjMGEwLCAweGUwNDMzYzIyLCAweDE3MWQxMjFiLCAweDBkMGIwZTA5LCAweGM3YWRmMjhiLCAweGE4YjkyZGI2LCAweGE5YzgxNDFlLCAweDE5ODU1N2YxLCAweDA3NGNhZjc1LCAweGRkYmJlZTk5LCAweDYwZmRhMzdmLCAweDI2OWZmNzAxLCAweGY1YmM1YzcyLCAweDNiYzU0NDY2LCAweDdlMzQ1YmZiLCAweDI5NzY4YjQzLCAweGM2ZGNjYjIzLCAweGZjNjhiNmVkLCAweGYxNjNiOGU0LCAweGRjY2FkNzMxLCAweDg1MTA0MjYzLCAweDIyNDAxMzk3LCAweDExMjA4NGM2LCAweDI0N2Q4NTRhLCAweDNkZjhkMmJiLCAweDMyMTFhZWY5LCAweGExNmRjNzI5LCAweDJmNGIxZDllLCAweDMwZjNkY2IyLCAweDUyZWMwZDg2LCAweGUzZDA3N2MxLCAweDE2NmMyYmIzLCAweGI5OTlhOTcwLCAweDQ4ZmExMTk0LCAweDY0MjI0N2U5LCAweDhjYzRhOGZjLCAweDNmMWFhMGYwLCAweDJjZDg1NjdkLCAweDkwZWYyMjMzLCAweDRlYzc4NzQ5LCAweGQxYzFkOTM4LCAweGEyZmU4Y2NhLCAweDBiMzY5OGQ0LCAweDgxY2ZhNmY1LCAweGRlMjhhNTdhLCAweDhlMjZkYWI3LCAweGJmYTQzZmFkLCAweDlkZTQyYzNhLCAweDkyMGQ1MDc4LCAweGNjOWI2YTVmLCAweDQ2NjI1NDdlLCAweDEzYzJmNjhkLCAweGI4ZTg5MGQ4LCAweGY3NWUyZTM5LCAweGFmZjU4MmMzLCAweDgwYmU5ZjVkLCAweDkzN2M2OWQwLCAweDJkYTk2ZmQ1LCAweDEyYjNjZjI1LCAweDk5M2JjOGFjLCAweDdkYTcxMDE4LCAweDYzNmVlODljLCAweGJiN2JkYjNiLCAweDc4MDljZDI2LCAweDE4ZjQ2ZTU5LCAweGI3MDFlYzlhLCAweDlhYTg4MzRmLCAweDZlNjVlNjk1LCAweGU2N2VhYWZmLCAweGNmMDgyMWJjLCAweGU4ZTZlZjE1LCAweDliZDliYWU3LCAweDM2Y2U0YTZmLCAweDA5ZDRlYTlmLCAweDdjZDYyOWIwLCAweGIyYWYzMWE0LCAweDIzMzEyYTNmLCAweDk0MzBjNmE1LCAweDY2YzAzNWEyLCAweGJjMzc3NDRlLCAweGNhYTZmYzgyLCAweGQwYjBlMDkwLCAweGQ4MTUzM2E3LCAweDk4NGFmMTA0LCAweGRhZjc0MWVjLCAweDUwMGU3ZmNkLCAweGY2MmYxNzkxLCAweGQ2OGQ3NjRkLCAweGIwNGQ0M2VmLCAweDRkNTRjY2FhLCAweDA0ZGZlNDk2LCAweGI1ZTM5ZWQxLCAweDg4MWI0YzZhLCAweDFmYjhjMTJjLCAweDUxN2Y0NjY1LCAweGVhMDQ5ZDVlLCAweDM1NWQwMThjLCAweDc0NzNmYTg3LCAweDQxMmVmYjBiLCAweDFkNWFiMzY3LCAweGQyNTI5MmRiLCAweDU2MzNlOTEwLCAweDQ3MTM2ZGQ2LCAweDYxOGM5YWQ3LCAweDBjN2EzN2ExLCAweDE0OGU1OWY4LCAweDNjODllYjEzLCAweDI3ZWVjZWE5LCAweGM5MzViNzYxLCAweGU1ZWRlMTFjLCAweGIxM2M3YTQ3LCAweGRmNTk5Y2QyLCAweDczM2Y1NWYyLCAweGNlNzkxODE0LCAweDM3YmY3M2M3LCAweGNkZWE1M2Y3LCAweGFhNWI1ZmZkLCAweDZmMTRkZjNkLCAweGRiODY3ODQ0LCAweGYzODFjYWFmLCAweGM0M2ViOTY4LCAweDM0MmMzODI0LCAweDQwNWZjMmEzLCAweGMzNzIxNjFkLCAweDI1MGNiY2UyLCAweDQ5OGIyODNjLCAweDk1NDFmZjBkLCAweDAxNzEzOWE4LCAweGIzZGUwODBjLCAweGU0OWNkOGI0LCAweGMxOTA2NDU2LCAweDg0NjE3YmNiLCAweGI2NzBkNTMyLCAweDVjNzQ0ODZjLCAweDU3NDJkMGI4XTtcbiAgICB2YXIgVDggPSBbMHhmNGE3NTA1MSwgMHg0MTY1NTM3ZSwgMHgxN2E0YzMxYSwgMHgyNzVlOTYzYSwgMHhhYjZiY2IzYiwgMHg5ZDQ1ZjExZiwgMHhmYTU4YWJhYywgMHhlMzAzOTM0YiwgMHgzMGZhNTUyMCwgMHg3NjZkZjZhZCwgMHhjYzc2OTE4OCwgMHgwMjRjMjVmNSwgMHhlNWQ3ZmM0ZiwgMHgyYWNiZDdjNSwgMHgzNTQ0ODAyNiwgMHg2MmEzOGZiNSwgMHhiMTVhNDlkZSwgMHhiYTFiNjcyNSwgMHhlYTBlOTg0NSwgMHhmZWMwZTE1ZCwgMHgyZjc1MDJjMywgMHg0Y2YwMTI4MSwgMHg0Njk3YTM4ZCwgMHhkM2Y5YzY2YiwgMHg4ZjVmZTcwMywgMHg5MjljOTUxNSwgMHg2ZDdhZWJiZiwgMHg1MjU5ZGE5NSwgMHhiZTgzMmRkNCwgMHg3NDIxZDM1OCwgMHhlMDY5Mjk0OSwgMHhjOWM4NDQ4ZSwgMHhjMjg5NmE3NSwgMHg4ZTc5NzhmNCwgMHg1ODNlNmI5OSwgMHhiOTcxZGQyNywgMHhlMTRmYjZiZSwgMHg4OGFkMTdmMCwgMHgyMGFjNjZjOSwgMHhjZTNhYjQ3ZCwgMHhkZjRhMTg2MywgMHgxYTMxODJlNSwgMHg1MTMzNjA5NywgMHg1MzdmNDU2MiwgMHg2NDc3ZTBiMSwgMHg2YmFlODRiYiwgMHg4MWEwMWNmZSwgMHgwODJiOTRmOSwgMHg0ODY4NTg3MCwgMHg0NWZkMTk4ZiwgMHhkZTZjODc5NCwgMHg3YmY4Yjc1MiwgMHg3M2QzMjNhYiwgMHg0YjAyZTI3MiwgMHgxZjhmNTdlMywgMHg1NWFiMmE2NiwgMHhlYjI4MDdiMiwgMHhiNWMyMDMyZiwgMHhjNTdiOWE4NiwgMHgzNzA4YTVkMywgMHgyODg3ZjIzMCwgMHhiZmE1YjIyMywgMHgwMzZhYmEwMiwgMHgxNjgyNWNlZCwgMHhjZjFjMmI4YSwgMHg3OWI0OTJhNywgMHgwN2YyZjBmMywgMHg2OWUyYTE0ZSwgMHhkYWY0Y2Q2NSwgMHgwNWJlZDUwNiwgMHgzNDYyMWZkMSwgMHhhNmZlOGFjNCwgMHgyZTUzOWQzNCwgMHhmMzU1YTBhMiwgMHg4YWUxMzIwNSwgMHhmNmViNzVhNCwgMHg4M2VjMzkwYiwgMHg2MGVmYWE0MCwgMHg3MTlmMDY1ZSwgMHg2ZTEwNTFiZCwgMHgyMThhZjkzZSwgMHhkZDA2M2Q5NiwgMHgzZTA1YWVkZCwgMHhlNmJkNDY0ZCwgMHg1NDhkYjU5MSwgMHhjNDVkMDU3MSwgMHgwNmQ0NmYwNCwgMHg1MDE1ZmY2MCwgMHg5OGZiMjQxOSwgMHhiZGU5OTdkNiwgMHg0MDQzY2M4OSwgMHhkOTllNzc2NywgMHhlODQyYmRiMCwgMHg4OThiODgwNywgMHgxOTViMzhlNywgMHhjOGVlZGI3OSwgMHg3YzBhNDdhMSwgMHg0MjBmZTk3YywgMHg4NDFlYzlmOCwgMHgwMDAwMDAwMCwgMHg4MDg2ODMwOSwgMHgyYmVkNDgzMiwgMHgxMTcwYWMxZSwgMHg1YTcyNGU2YywgMHgwZWZmZmJmZCwgMHg4NTM4NTYwZiwgMHhhZWQ1MWUzZCwgMHgyZDM5MjczNiwgMHgwZmQ5NjQwYSwgMHg1Y2E2MjE2OCwgMHg1YjU0ZDE5YiwgMHgzNjJlM2EyNCwgMHgwYTY3YjEwYywgMHg1N2U3MGY5MywgMHhlZTk2ZDJiNCwgMHg5YjkxOWUxYiwgMHhjMGM1NGY4MCwgMHhkYzIwYTI2MSwgMHg3NzRiNjk1YSwgMHgxMjFhMTYxYywgMHg5M2JhMGFlMiwgMHhhMDJhZTVjMCwgMHgyMmUwNDMzYywgMHgxYjE3MWQxMiwgMHgwOTBkMGIwZSwgMHg4YmM3YWRmMiwgMHhiNmE4YjkyZCwgMHgxZWE5YzgxNCwgMHhmMTE5ODU1NywgMHg3NTA3NGNhZiwgMHg5OWRkYmJlZSwgMHg3ZjYwZmRhMywgMHgwMTI2OWZmNywgMHg3MmY1YmM1YywgMHg2NjNiYzU0NCwgMHhmYjdlMzQ1YiwgMHg0MzI5NzY4YiwgMHgyM2M2ZGNjYiwgMHhlZGZjNjhiNiwgMHhlNGYxNjNiOCwgMHgzMWRjY2FkNywgMHg2Mzg1MTA0MiwgMHg5NzIyNDAxMywgMHhjNjExMjA4NCwgMHg0YTI0N2Q4NSwgMHhiYjNkZjhkMiwgMHhmOTMyMTFhZSwgMHgyOWExNmRjNywgMHg5ZTJmNGIxZCwgMHhiMjMwZjNkYywgMHg4NjUyZWMwZCwgMHhjMWUzZDA3NywgMHhiMzE2NmMyYiwgMHg3MGI5OTlhOSwgMHg5NDQ4ZmExMSwgMHhlOTY0MjI0NywgMHhmYzhjYzRhOCwgMHhmMDNmMWFhMCwgMHg3ZDJjZDg1NiwgMHgzMzkwZWYyMiwgMHg0OTRlYzc4NywgMHgzOGQxYzFkOSwgMHhjYWEyZmU4YywgMHhkNDBiMzY5OCwgMHhmNTgxY2ZhNiwgMHg3YWRlMjhhNSwgMHhiNzhlMjZkYSwgMHhhZGJmYTQzZiwgMHgzYTlkZTQyYywgMHg3ODkyMGQ1MCwgMHg1ZmNjOWI2YSwgMHg3ZTQ2NjI1NCwgMHg4ZDEzYzJmNiwgMHhkOGI4ZTg5MCwgMHgzOWY3NWUyZSwgMHhjM2FmZjU4MiwgMHg1ZDgwYmU5ZiwgMHhkMDkzN2M2OSwgMHhkNTJkYTk2ZiwgMHgyNTEyYjNjZiwgMHhhYzk5M2JjOCwgMHgxODdkYTcxMCwgMHg5YzYzNmVlOCwgMHgzYmJiN2JkYiwgMHgyNjc4MDljZCwgMHg1OTE4ZjQ2ZSwgMHg5YWI3MDFlYywgMHg0ZjlhYTg4MywgMHg5NTZlNjVlNiwgMHhmZmU2N2VhYSwgMHhiY2NmMDgyMSwgMHgxNWU4ZTZlZiwgMHhlNzliZDliYSwgMHg2ZjM2Y2U0YSwgMHg5ZjA5ZDRlYSwgMHhiMDdjZDYyOSwgMHhhNGIyYWYzMSwgMHgzZjIzMzEyYSwgMHhhNTk0MzBjNiwgMHhhMjY2YzAzNSwgMHg0ZWJjMzc3NCwgMHg4MmNhYTZmYywgMHg5MGQwYjBlMCwgMHhhN2Q4MTUzMywgMHgwNDk4NGFmMSwgMHhlY2RhZjc0MSwgMHhjZDUwMGU3ZiwgMHg5MWY2MmYxNywgMHg0ZGQ2OGQ3NiwgMHhlZmIwNGQ0MywgMHhhYTRkNTRjYywgMHg5NjA0ZGZlNCwgMHhkMWI1ZTM5ZSwgMHg2YTg4MWI0YywgMHgyYzFmYjhjMSwgMHg2NTUxN2Y0NiwgMHg1ZWVhMDQ5ZCwgMHg4YzM1NWQwMSwgMHg4Nzc0NzNmYSwgMHgwYjQxMmVmYiwgMHg2NzFkNWFiMywgMHhkYmQyNTI5MiwgMHgxMDU2MzNlOSwgMHhkNjQ3MTM2ZCwgMHhkNzYxOGM5YSwgMHhhMTBjN2EzNywgMHhmODE0OGU1OSwgMHgxMzNjODllYiwgMHhhOTI3ZWVjZSwgMHg2MWM5MzViNywgMHgxY2U1ZWRlMSwgMHg0N2IxM2M3YSwgMHhkMmRmNTk5YywgMHhmMjczM2Y1NSwgMHgxNGNlNzkxOCwgMHhjNzM3YmY3MywgMHhmN2NkZWE1MywgMHhmZGFhNWI1ZiwgMHgzZDZmMTRkZiwgMHg0NGRiODY3OCwgMHhhZmYzODFjYSwgMHg2OGM0M2ViOSwgMHgyNDM0MmMzOCwgMHhhMzQwNWZjMiwgMHgxZGMzNzIxNiwgMHhlMjI1MGNiYywgMHgzYzQ5OGIyOCwgMHgwZDk1NDFmZiwgMHhhODAxNzEzOSwgMHgwY2IzZGUwOCwgMHhiNGU0OWNkOCwgMHg1NmMxOTA2NCwgMHhjYjg0NjE3YiwgMHgzMmI2NzBkNSwgMHg2YzVjNzQ0OCwgMHhiODU3NDJkMF07XG5cbiAgICAvLyBUcmFuc2Zvcm1hdGlvbnMgZm9yIGRlY3J5cHRpb24ga2V5IGV4cGFuc2lvblxuICAgIHZhciBVMSA9IFsweDAwMDAwMDAwLCAweDBlMDkwZDBiLCAweDFjMTIxYTE2LCAweDEyMWIxNzFkLCAweDM4MjQzNDJjLCAweDM2MmQzOTI3LCAweDI0MzYyZTNhLCAweDJhM2YyMzMxLCAweDcwNDg2ODU4LCAweDdlNDE2NTUzLCAweDZjNWE3MjRlLCAweDYyNTM3ZjQ1LCAweDQ4NmM1Yzc0LCAweDQ2NjU1MTdmLCAweDU0N2U0NjYyLCAweDVhNzc0YjY5LCAweGUwOTBkMGIwLCAweGVlOTlkZGJiLCAweGZjODJjYWE2LCAweGYyOGJjN2FkLCAweGQ4YjRlNDljLCAweGQ2YmRlOTk3LCAweGM0YTZmZThhLCAweGNhYWZmMzgxLCAweDkwZDhiOGU4LCAweDllZDFiNWUzLCAweDhjY2FhMmZlLCAweDgyYzNhZmY1LCAweGE4ZmM4Y2M0LCAweGE2ZjU4MWNmLCAweGI0ZWU5NmQyLCAweGJhZTc5YmQ5LCAweGRiM2JiYjdiLCAweGQ1MzJiNjcwLCAweGM3MjlhMTZkLCAweGM5MjBhYzY2LCAweGUzMWY4ZjU3LCAweGVkMTY4MjVjLCAweGZmMGQ5NTQxLCAweGYxMDQ5ODRhLCAweGFiNzNkMzIzLCAweGE1N2FkZTI4LCAweGI3NjFjOTM1LCAweGI5NjhjNDNlLCAweDkzNTdlNzBmLCAweDlkNWVlYTA0LCAweDhmNDVmZDE5LCAweDgxNGNmMDEyLCAweDNiYWI2YmNiLCAweDM1YTI2NmMwLCAweDI3Yjk3MWRkLCAweDI5YjA3Y2Q2LCAweDAzOGY1ZmU3LCAweDBkODY1MmVjLCAweDFmOWQ0NWYxLCAweDExOTQ0OGZhLCAweDRiZTMwMzkzLCAweDQ1ZWEwZTk4LCAweDU3ZjExOTg1LCAweDU5ZjgxNDhlLCAweDczYzczN2JmLCAweDdkY2UzYWI0LCAweDZmZDUyZGE5LCAweDYxZGMyMGEyLCAweGFkNzY2ZGY2LCAweGEzN2Y2MGZkLCAweGIxNjQ3N2UwLCAweGJmNmQ3YWViLCAweDk1NTI1OWRhLCAweDliNWI1NGQxLCAweDg5NDA0M2NjLCAweDg3NDk0ZWM3LCAweGRkM2UwNWFlLCAweGQzMzcwOGE1LCAweGMxMmMxZmI4LCAweGNmMjUxMmIzLCAweGU1MWEzMTgyLCAweGViMTMzYzg5LCAweGY5MDgyYjk0LCAweGY3MDEyNjlmLCAweDRkZTZiZDQ2LCAweDQzZWZiMDRkLCAweDUxZjRhNzUwLCAweDVmZmRhYTViLCAweDc1YzI4OTZhLCAweDdiY2I4NDYxLCAweDY5ZDA5MzdjLCAweDY3ZDk5ZTc3LCAweDNkYWVkNTFlLCAweDMzYTdkODE1LCAweDIxYmNjZjA4LCAweDJmYjVjMjAzLCAweDA1OGFlMTMyLCAweDBiODNlYzM5LCAweDE5OThmYjI0LCAweDE3OTFmNjJmLCAweDc2NGRkNjhkLCAweDc4NDRkYjg2LCAweDZhNWZjYzliLCAweDY0NTZjMTkwLCAweDRlNjllMmExLCAweDQwNjBlZmFhLCAweDUyN2JmOGI3LCAweDVjNzJmNWJjLCAweDA2MDViZWQ1LCAweDA4MGNiM2RlLCAweDFhMTdhNGMzLCAweDE0MWVhOWM4LCAweDNlMjE4YWY5LCAweDMwMjg4N2YyLCAweDIyMzM5MGVmLCAweDJjM2E5ZGU0LCAweDk2ZGQwNjNkLCAweDk4ZDQwYjM2LCAweDhhY2YxYzJiLCAweDg0YzYxMTIwLCAweGFlZjkzMjExLCAweGEwZjAzZjFhLCAweGIyZWIyODA3LCAweGJjZTIyNTBjLCAweGU2OTU2ZTY1LCAweGU4OWM2MzZlLCAweGZhODc3NDczLCAweGY0OGU3OTc4LCAweGRlYjE1YTQ5LCAweGQwYjg1NzQyLCAweGMyYTM0MDVmLCAweGNjYWE0ZDU0LCAweDQxZWNkYWY3LCAweDRmZTVkN2ZjLCAweDVkZmVjMGUxLCAweDUzZjdjZGVhLCAweDc5YzhlZWRiLCAweDc3YzFlM2QwLCAweDY1ZGFmNGNkLCAweDZiZDNmOWM2LCAweDMxYTRiMmFmLCAweDNmYWRiZmE0LCAweDJkYjZhOGI5LCAweDIzYmZhNWIyLCAweDA5ODA4NjgzLCAweDA3ODk4Yjg4LCAweDE1OTI5Yzk1LCAweDFiOWI5MTllLCAweGExN2MwYTQ3LCAweGFmNzUwNzRjLCAweGJkNmUxMDUxLCAweGIzNjcxZDVhLCAweDk5NTgzZTZiLCAweDk3NTEzMzYwLCAweDg1NGEyNDdkLCAweDhiNDMyOTc2LCAweGQxMzQ2MjFmLCAweGRmM2Q2ZjE0LCAweGNkMjY3ODA5LCAweGMzMmY3NTAyLCAweGU5MTA1NjMzLCAweGU3MTk1YjM4LCAweGY1MDI0YzI1LCAweGZiMGI0MTJlLCAweDlhZDc2MThjLCAweDk0ZGU2Yzg3LCAweDg2YzU3YjlhLCAweDg4Y2M3NjkxLCAweGEyZjM1NWEwLCAweGFjZmE1OGFiLCAweGJlZTE0ZmI2LCAweGIwZTg0MmJkLCAweGVhOWYwOWQ0LCAweGU0OTYwNGRmLCAweGY2OGQxM2MyLCAweGY4ODQxZWM5LCAweGQyYmIzZGY4LCAweGRjYjIzMGYzLCAweGNlYTkyN2VlLCAweGMwYTAyYWU1LCAweDdhNDdiMTNjLCAweDc0NGViYzM3LCAweDY2NTVhYjJhLCAweDY4NWNhNjIxLCAweDQyNjM4NTEwLCAweDRjNmE4ODFiLCAweDVlNzE5ZjA2LCAweDUwNzg5MjBkLCAweDBhMGZkOTY0LCAweDA0MDZkNDZmLCAweDE2MWRjMzcyLCAweDE4MTRjZTc5LCAweDMyMmJlZDQ4LCAweDNjMjJlMDQzLCAweDJlMzlmNzVlLCAweDIwMzBmYTU1LCAweGVjOWFiNzAxLCAweGUyOTNiYTBhLCAweGYwODhhZDE3LCAweGZlODFhMDFjLCAweGQ0YmU4MzJkLCAweGRhYjc4ZTI2LCAweGM4YWM5OTNiLCAweGM2YTU5NDMwLCAweDljZDJkZjU5LCAweDkyZGJkMjUyLCAweDgwYzBjNTRmLCAweDhlYzljODQ0LCAweGE0ZjZlYjc1LCAweGFhZmZlNjdlLCAweGI4ZTRmMTYzLCAweGI2ZWRmYzY4LCAweDBjMGE2N2IxLCAweDAyMDM2YWJhLCAweDEwMTg3ZGE3LCAweDFlMTE3MGFjLCAweDM0MmU1MzlkLCAweDNhMjc1ZTk2LCAweDI4M2M0OThiLCAweDI2MzU0NDgwLCAweDdjNDIwZmU5LCAweDcyNGIwMmUyLCAweDYwNTAxNWZmLCAweDZlNTkxOGY0LCAweDQ0NjYzYmM1LCAweDRhNmYzNmNlLCAweDU4NzQyMWQzLCAweDU2N2QyY2Q4LCAweDM3YTEwYzdhLCAweDM5YTgwMTcxLCAweDJiYjMxNjZjLCAweDI1YmExYjY3LCAweDBmODUzODU2LCAweDAxOGMzNTVkLCAweDEzOTcyMjQwLCAweDFkOWUyZjRiLCAweDQ3ZTk2NDIyLCAweDQ5ZTA2OTI5LCAweDViZmI3ZTM0LCAweDU1ZjI3MzNmLCAweDdmY2Q1MDBlLCAweDcxYzQ1ZDA1LCAweDYzZGY0YTE4LCAweDZkZDY0NzEzLCAweGQ3MzFkY2NhLCAweGQ5MzhkMWMxLCAweGNiMjNjNmRjLCAweGM1MmFjYmQ3LCAweGVmMTVlOGU2LCAweGUxMWNlNWVkLCAweGYzMDdmMmYwLCAweGZkMGVmZmZiLCAweGE3NzliNDkyLCAweGE5NzBiOTk5LCAweGJiNmJhZTg0LCAweGI1NjJhMzhmLCAweDlmNWQ4MGJlLCAweDkxNTQ4ZGI1LCAweDgzNGY5YWE4LCAweDhkNDY5N2EzXTtcbiAgICB2YXIgVTIgPSBbMHgwMDAwMDAwMCwgMHgwYjBlMDkwZCwgMHgxNjFjMTIxYSwgMHgxZDEyMWIxNywgMHgyYzM4MjQzNCwgMHgyNzM2MmQzOSwgMHgzYTI0MzYyZSwgMHgzMTJhM2YyMywgMHg1ODcwNDg2OCwgMHg1MzdlNDE2NSwgMHg0ZTZjNWE3MiwgMHg0NTYyNTM3ZiwgMHg3NDQ4NmM1YywgMHg3ZjQ2NjU1MSwgMHg2MjU0N2U0NiwgMHg2OTVhNzc0YiwgMHhiMGUwOTBkMCwgMHhiYmVlOTlkZCwgMHhhNmZjODJjYSwgMHhhZGYyOGJjNywgMHg5Y2Q4YjRlNCwgMHg5N2Q2YmRlOSwgMHg4YWM0YTZmZSwgMHg4MWNhYWZmMywgMHhlODkwZDhiOCwgMHhlMzllZDFiNSwgMHhmZThjY2FhMiwgMHhmNTgyYzNhZiwgMHhjNGE4ZmM4YywgMHhjZmE2ZjU4MSwgMHhkMmI0ZWU5NiwgMHhkOWJhZTc5YiwgMHg3YmRiM2JiYiwgMHg3MGQ1MzJiNiwgMHg2ZGM3MjlhMSwgMHg2NmM5MjBhYywgMHg1N2UzMWY4ZiwgMHg1Y2VkMTY4MiwgMHg0MWZmMGQ5NSwgMHg0YWYxMDQ5OCwgMHgyM2FiNzNkMywgMHgyOGE1N2FkZSwgMHgzNWI3NjFjOSwgMHgzZWI5NjhjNCwgMHgwZjkzNTdlNywgMHgwNDlkNWVlYSwgMHgxOThmNDVmZCwgMHgxMjgxNGNmMCwgMHhjYjNiYWI2YiwgMHhjMDM1YTI2NiwgMHhkZDI3Yjk3MSwgMHhkNjI5YjA3YywgMHhlNzAzOGY1ZiwgMHhlYzBkODY1MiwgMHhmMTFmOWQ0NSwgMHhmYTExOTQ0OCwgMHg5MzRiZTMwMywgMHg5ODQ1ZWEwZSwgMHg4NTU3ZjExOSwgMHg4ZTU5ZjgxNCwgMHhiZjczYzczNywgMHhiNDdkY2UzYSwgMHhhOTZmZDUyZCwgMHhhMjYxZGMyMCwgMHhmNmFkNzY2ZCwgMHhmZGEzN2Y2MCwgMHhlMGIxNjQ3NywgMHhlYmJmNmQ3YSwgMHhkYTk1NTI1OSwgMHhkMTliNWI1NCwgMHhjYzg5NDA0MywgMHhjNzg3NDk0ZSwgMHhhZWRkM2UwNSwgMHhhNWQzMzcwOCwgMHhiOGMxMmMxZiwgMHhiM2NmMjUxMiwgMHg4MmU1MWEzMSwgMHg4OWViMTMzYywgMHg5NGY5MDgyYiwgMHg5ZmY3MDEyNiwgMHg0NjRkZTZiZCwgMHg0ZDQzZWZiMCwgMHg1MDUxZjRhNywgMHg1YjVmZmRhYSwgMHg2YTc1YzI4OSwgMHg2MTdiY2I4NCwgMHg3YzY5ZDA5MywgMHg3NzY3ZDk5ZSwgMHgxZTNkYWVkNSwgMHgxNTMzYTdkOCwgMHgwODIxYmNjZiwgMHgwMzJmYjVjMiwgMHgzMjA1OGFlMSwgMHgzOTBiODNlYywgMHgyNDE5OThmYiwgMHgyZjE3OTFmNiwgMHg4ZDc2NGRkNiwgMHg4Njc4NDRkYiwgMHg5YjZhNWZjYywgMHg5MDY0NTZjMSwgMHhhMTRlNjllMiwgMHhhYTQwNjBlZiwgMHhiNzUyN2JmOCwgMHhiYzVjNzJmNSwgMHhkNTA2MDViZSwgMHhkZTA4MGNiMywgMHhjMzFhMTdhNCwgMHhjODE0MWVhOSwgMHhmOTNlMjE4YSwgMHhmMjMwMjg4NywgMHhlZjIyMzM5MCwgMHhlNDJjM2E5ZCwgMHgzZDk2ZGQwNiwgMHgzNjk4ZDQwYiwgMHgyYjhhY2YxYywgMHgyMDg0YzYxMSwgMHgxMWFlZjkzMiwgMHgxYWEwZjAzZiwgMHgwN2IyZWIyOCwgMHgwY2JjZTIyNSwgMHg2NWU2OTU2ZSwgMHg2ZWU4OWM2MywgMHg3M2ZhODc3NCwgMHg3OGY0OGU3OSwgMHg0OWRlYjE1YSwgMHg0MmQwYjg1NywgMHg1ZmMyYTM0MCwgMHg1NGNjYWE0ZCwgMHhmNzQxZWNkYSwgMHhmYzRmZTVkNywgMHhlMTVkZmVjMCwgMHhlYTUzZjdjZCwgMHhkYjc5YzhlZSwgMHhkMDc3YzFlMywgMHhjZDY1ZGFmNCwgMHhjNjZiZDNmOSwgMHhhZjMxYTRiMiwgMHhhNDNmYWRiZiwgMHhiOTJkYjZhOCwgMHhiMjIzYmZhNSwgMHg4MzA5ODA4NiwgMHg4ODA3ODk4YiwgMHg5NTE1OTI5YywgMHg5ZTFiOWI5MSwgMHg0N2ExN2MwYSwgMHg0Y2FmNzUwNywgMHg1MWJkNmUxMCwgMHg1YWIzNjcxZCwgMHg2Yjk5NTgzZSwgMHg2MDk3NTEzMywgMHg3ZDg1NGEyNCwgMHg3NjhiNDMyOSwgMHgxZmQxMzQ2MiwgMHgxNGRmM2Q2ZiwgMHgwOWNkMjY3OCwgMHgwMmMzMmY3NSwgMHgzM2U5MTA1NiwgMHgzOGU3MTk1YiwgMHgyNWY1MDI0YywgMHgyZWZiMGI0MSwgMHg4YzlhZDc2MSwgMHg4Nzk0ZGU2YywgMHg5YTg2YzU3YiwgMHg5MTg4Y2M3NiwgMHhhMGEyZjM1NSwgMHhhYmFjZmE1OCwgMHhiNmJlZTE0ZiwgMHhiZGIwZTg0MiwgMHhkNGVhOWYwOSwgMHhkZmU0OTYwNCwgMHhjMmY2OGQxMywgMHhjOWY4ODQxZSwgMHhmOGQyYmIzZCwgMHhmM2RjYjIzMCwgMHhlZWNlYTkyNywgMHhlNWMwYTAyYSwgMHgzYzdhNDdiMSwgMHgzNzc0NGViYywgMHgyYTY2NTVhYiwgMHgyMTY4NWNhNiwgMHgxMDQyNjM4NSwgMHgxYjRjNmE4OCwgMHgwNjVlNzE5ZiwgMHgwZDUwNzg5MiwgMHg2NDBhMGZkOSwgMHg2ZjA0MDZkNCwgMHg3MjE2MWRjMywgMHg3OTE4MTRjZSwgMHg0ODMyMmJlZCwgMHg0MzNjMjJlMCwgMHg1ZTJlMzlmNywgMHg1NTIwMzBmYSwgMHgwMWVjOWFiNywgMHgwYWUyOTNiYSwgMHgxN2YwODhhZCwgMHgxY2ZlODFhMCwgMHgyZGQ0YmU4MywgMHgyNmRhYjc4ZSwgMHgzYmM4YWM5OSwgMHgzMGM2YTU5NCwgMHg1OTljZDJkZiwgMHg1MjkyZGJkMiwgMHg0ZjgwYzBjNSwgMHg0NDhlYzljOCwgMHg3NWE0ZjZlYiwgMHg3ZWFhZmZlNiwgMHg2M2I4ZTRmMSwgMHg2OGI2ZWRmYywgMHhiMTBjMGE2NywgMHhiYTAyMDM2YSwgMHhhNzEwMTg3ZCwgMHhhYzFlMTE3MCwgMHg5ZDM0MmU1MywgMHg5NjNhMjc1ZSwgMHg4YjI4M2M0OSwgMHg4MDI2MzU0NCwgMHhlOTdjNDIwZiwgMHhlMjcyNGIwMiwgMHhmZjYwNTAxNSwgMHhmNDZlNTkxOCwgMHhjNTQ0NjYzYiwgMHhjZTRhNmYzNiwgMHhkMzU4NzQyMSwgMHhkODU2N2QyYywgMHg3YTM3YTEwYywgMHg3MTM5YTgwMSwgMHg2YzJiYjMxNiwgMHg2NzI1YmExYiwgMHg1NjBmODUzOCwgMHg1ZDAxOGMzNSwgMHg0MDEzOTcyMiwgMHg0YjFkOWUyZiwgMHgyMjQ3ZTk2NCwgMHgyOTQ5ZTA2OSwgMHgzNDViZmI3ZSwgMHgzZjU1ZjI3MywgMHgwZTdmY2Q1MCwgMHgwNTcxYzQ1ZCwgMHgxODYzZGY0YSwgMHgxMzZkZDY0NywgMHhjYWQ3MzFkYywgMHhjMWQ5MzhkMSwgMHhkY2NiMjNjNiwgMHhkN2M1MmFjYiwgMHhlNmVmMTVlOCwgMHhlZGUxMWNlNSwgMHhmMGYzMDdmMiwgMHhmYmZkMGVmZiwgMHg5MmE3NzliNCwgMHg5OWE5NzBiOSwgMHg4NGJiNmJhZSwgMHg4ZmI1NjJhMywgMHhiZTlmNWQ4MCwgMHhiNTkxNTQ4ZCwgMHhhODgzNGY5YSwgMHhhMzhkNDY5N107XG4gICAgdmFyIFUzID0gWzB4MDAwMDAwMDAsIDB4MGQwYjBlMDksIDB4MWExNjFjMTIsIDB4MTcxZDEyMWIsIDB4MzQyYzM4MjQsIDB4MzkyNzM2MmQsIDB4MmUzYTI0MzYsIDB4MjMzMTJhM2YsIDB4Njg1ODcwNDgsIDB4NjU1MzdlNDEsIDB4NzI0ZTZjNWEsIDB4N2Y0NTYyNTMsIDB4NWM3NDQ4NmMsIDB4NTE3ZjQ2NjUsIDB4NDY2MjU0N2UsIDB4NGI2OTVhNzcsIDB4ZDBiMGUwOTAsIDB4ZGRiYmVlOTksIDB4Y2FhNmZjODIsIDB4YzdhZGYyOGIsIDB4ZTQ5Y2Q4YjQsIDB4ZTk5N2Q2YmQsIDB4ZmU4YWM0YTYsIDB4ZjM4MWNhYWYsIDB4YjhlODkwZDgsIDB4YjVlMzllZDEsIDB4YTJmZThjY2EsIDB4YWZmNTgyYzMsIDB4OGNjNGE4ZmMsIDB4ODFjZmE2ZjUsIDB4OTZkMmI0ZWUsIDB4OWJkOWJhZTcsIDB4YmI3YmRiM2IsIDB4YjY3MGQ1MzIsIDB4YTE2ZGM3MjksIDB4YWM2NmM5MjAsIDB4OGY1N2UzMWYsIDB4ODI1Y2VkMTYsIDB4OTU0MWZmMGQsIDB4OTg0YWYxMDQsIDB4ZDMyM2FiNzMsIDB4ZGUyOGE1N2EsIDB4YzkzNWI3NjEsIDB4YzQzZWI5NjgsIDB4ZTcwZjkzNTcsIDB4ZWEwNDlkNWUsIDB4ZmQxOThmNDUsIDB4ZjAxMjgxNGMsIDB4NmJjYjNiYWIsIDB4NjZjMDM1YTIsIDB4NzFkZDI3YjksIDB4N2NkNjI5YjAsIDB4NWZlNzAzOGYsIDB4NTJlYzBkODYsIDB4NDVmMTFmOWQsIDB4NDhmYTExOTQsIDB4MDM5MzRiZTMsIDB4MGU5ODQ1ZWEsIDB4MTk4NTU3ZjEsIDB4MTQ4ZTU5ZjgsIDB4MzdiZjczYzcsIDB4M2FiNDdkY2UsIDB4MmRhOTZmZDUsIDB4MjBhMjYxZGMsIDB4NmRmNmFkNzYsIDB4NjBmZGEzN2YsIDB4NzdlMGIxNjQsIDB4N2FlYmJmNmQsIDB4NTlkYTk1NTIsIDB4NTRkMTliNWIsIDB4NDNjYzg5NDAsIDB4NGVjNzg3NDksIDB4MDVhZWRkM2UsIDB4MDhhNWQzMzcsIDB4MWZiOGMxMmMsIDB4MTJiM2NmMjUsIDB4MzE4MmU1MWEsIDB4M2M4OWViMTMsIDB4MmI5NGY5MDgsIDB4MjY5ZmY3MDEsIDB4YmQ0NjRkZTYsIDB4YjA0ZDQzZWYsIDB4YTc1MDUxZjQsIDB4YWE1YjVmZmQsIDB4ODk2YTc1YzIsIDB4ODQ2MTdiY2IsIDB4OTM3YzY5ZDAsIDB4OWU3NzY3ZDksIDB4ZDUxZTNkYWUsIDB4ZDgxNTMzYTcsIDB4Y2YwODIxYmMsIDB4YzIwMzJmYjUsIDB4ZTEzMjA1OGEsIDB4ZWMzOTBiODMsIDB4ZmIyNDE5OTgsIDB4ZjYyZjE3OTEsIDB4ZDY4ZDc2NGQsIDB4ZGI4Njc4NDQsIDB4Y2M5YjZhNWYsIDB4YzE5MDY0NTYsIDB4ZTJhMTRlNjksIDB4ZWZhYTQwNjAsIDB4ZjhiNzUyN2IsIDB4ZjViYzVjNzIsIDB4YmVkNTA2MDUsIDB4YjNkZTA4MGMsIDB4YTRjMzFhMTcsIDB4YTljODE0MWUsIDB4OGFmOTNlMjEsIDB4ODdmMjMwMjgsIDB4OTBlZjIyMzMsIDB4OWRlNDJjM2EsIDB4MDYzZDk2ZGQsIDB4MGIzNjk4ZDQsIDB4MWMyYjhhY2YsIDB4MTEyMDg0YzYsIDB4MzIxMWFlZjksIDB4M2YxYWEwZjAsIDB4MjgwN2IyZWIsIDB4MjUwY2JjZTIsIDB4NmU2NWU2OTUsIDB4NjM2ZWU4OWMsIDB4NzQ3M2ZhODcsIDB4Nzk3OGY0OGUsIDB4NWE0OWRlYjEsIDB4NTc0MmQwYjgsIDB4NDA1ZmMyYTMsIDB4NGQ1NGNjYWEsIDB4ZGFmNzQxZWMsIDB4ZDdmYzRmZTUsIDB4YzBlMTVkZmUsIDB4Y2RlYTUzZjcsIDB4ZWVkYjc5YzgsIDB4ZTNkMDc3YzEsIDB4ZjRjZDY1ZGEsIDB4ZjljNjZiZDMsIDB4YjJhZjMxYTQsIDB4YmZhNDNmYWQsIDB4YThiOTJkYjYsIDB4YTViMjIzYmYsIDB4ODY4MzA5ODAsIDB4OGI4ODA3ODksIDB4OWM5NTE1OTIsIDB4OTE5ZTFiOWIsIDB4MGE0N2ExN2MsIDB4MDc0Y2FmNzUsIDB4MTA1MWJkNmUsIDB4MWQ1YWIzNjcsIDB4M2U2Yjk5NTgsIDB4MzM2MDk3NTEsIDB4MjQ3ZDg1NGEsIDB4Mjk3NjhiNDMsIDB4NjIxZmQxMzQsIDB4NmYxNGRmM2QsIDB4NzgwOWNkMjYsIDB4NzUwMmMzMmYsIDB4NTYzM2U5MTAsIDB4NWIzOGU3MTksIDB4NGMyNWY1MDIsIDB4NDEyZWZiMGIsIDB4NjE4YzlhZDcsIDB4NmM4Nzk0ZGUsIDB4N2I5YTg2YzUsIDB4NzY5MTg4Y2MsIDB4NTVhMGEyZjMsIDB4NThhYmFjZmEsIDB4NGZiNmJlZTEsIDB4NDJiZGIwZTgsIDB4MDlkNGVhOWYsIDB4MDRkZmU0OTYsIDB4MTNjMmY2OGQsIDB4MWVjOWY4ODQsIDB4M2RmOGQyYmIsIDB4MzBmM2RjYjIsIDB4MjdlZWNlYTksIDB4MmFlNWMwYTAsIDB4YjEzYzdhNDcsIDB4YmMzNzc0NGUsIDB4YWIyYTY2NTUsIDB4YTYyMTY4NWMsIDB4ODUxMDQyNjMsIDB4ODgxYjRjNmEsIDB4OWYwNjVlNzEsIDB4OTIwZDUwNzgsIDB4ZDk2NDBhMGYsIDB4ZDQ2ZjA0MDYsIDB4YzM3MjE2MWQsIDB4Y2U3OTE4MTQsIDB4ZWQ0ODMyMmIsIDB4ZTA0MzNjMjIsIDB4Zjc1ZTJlMzksIDB4ZmE1NTIwMzAsIDB4YjcwMWVjOWEsIDB4YmEwYWUyOTMsIDB4YWQxN2YwODgsIDB4YTAxY2ZlODEsIDB4ODMyZGQ0YmUsIDB4OGUyNmRhYjcsIDB4OTkzYmM4YWMsIDB4OTQzMGM2YTUsIDB4ZGY1OTljZDIsIDB4ZDI1MjkyZGIsIDB4YzU0ZjgwYzAsIDB4Yzg0NDhlYzksIDB4ZWI3NWE0ZjYsIDB4ZTY3ZWFhZmYsIDB4ZjE2M2I4ZTQsIDB4ZmM2OGI2ZWQsIDB4NjdiMTBjMGEsIDB4NmFiYTAyMDMsIDB4N2RhNzEwMTgsIDB4NzBhYzFlMTEsIDB4NTM5ZDM0MmUsIDB4NWU5NjNhMjcsIDB4NDk4YjI4M2MsIDB4NDQ4MDI2MzUsIDB4MGZlOTdjNDIsIDB4MDJlMjcyNGIsIDB4MTVmZjYwNTAsIDB4MThmNDZlNTksIDB4M2JjNTQ0NjYsIDB4MzZjZTRhNmYsIDB4MjFkMzU4NzQsIDB4MmNkODU2N2QsIDB4MGM3YTM3YTEsIDB4MDE3MTM5YTgsIDB4MTY2YzJiYjMsIDB4MWI2NzI1YmEsIDB4Mzg1NjBmODUsIDB4MzU1ZDAxOGMsIDB4MjI0MDEzOTcsIDB4MmY0YjFkOWUsIDB4NjQyMjQ3ZTksIDB4NjkyOTQ5ZTAsIDB4N2UzNDViZmIsIDB4NzMzZjU1ZjIsIDB4NTAwZTdmY2QsIDB4NWQwNTcxYzQsIDB4NGExODYzZGYsIDB4NDcxMzZkZDYsIDB4ZGNjYWQ3MzEsIDB4ZDFjMWQ5MzgsIDB4YzZkY2NiMjMsIDB4Y2JkN2M1MmEsIDB4ZThlNmVmMTUsIDB4ZTVlZGUxMWMsIDB4ZjJmMGYzMDcsIDB4ZmZmYmZkMGUsIDB4YjQ5MmE3NzksIDB4Yjk5OWE5NzAsIDB4YWU4NGJiNmIsIDB4YTM4ZmI1NjIsIDB4ODBiZTlmNWQsIDB4OGRiNTkxNTQsIDB4OWFhODgzNGYsIDB4OTdhMzhkNDZdO1xuICAgIHZhciBVNCA9IFsweDAwMDAwMDAwLCAweDA5MGQwYjBlLCAweDEyMWExNjFjLCAweDFiMTcxZDEyLCAweDI0MzQyYzM4LCAweDJkMzkyNzM2LCAweDM2MmUzYTI0LCAweDNmMjMzMTJhLCAweDQ4Njg1ODcwLCAweDQxNjU1MzdlLCAweDVhNzI0ZTZjLCAweDUzN2Y0NTYyLCAweDZjNWM3NDQ4LCAweDY1NTE3ZjQ2LCAweDdlNDY2MjU0LCAweDc3NGI2OTVhLCAweDkwZDBiMGUwLCAweDk5ZGRiYmVlLCAweDgyY2FhNmZjLCAweDhiYzdhZGYyLCAweGI0ZTQ5Y2Q4LCAweGJkZTk5N2Q2LCAweGE2ZmU4YWM0LCAweGFmZjM4MWNhLCAweGQ4YjhlODkwLCAweGQxYjVlMzllLCAweGNhYTJmZThjLCAweGMzYWZmNTgyLCAweGZjOGNjNGE4LCAweGY1ODFjZmE2LCAweGVlOTZkMmI0LCAweGU3OWJkOWJhLCAweDNiYmI3YmRiLCAweDMyYjY3MGQ1LCAweDI5YTE2ZGM3LCAweDIwYWM2NmM5LCAweDFmOGY1N2UzLCAweDE2ODI1Y2VkLCAweDBkOTU0MWZmLCAweDA0OTg0YWYxLCAweDczZDMyM2FiLCAweDdhZGUyOGE1LCAweDYxYzkzNWI3LCAweDY4YzQzZWI5LCAweDU3ZTcwZjkzLCAweDVlZWEwNDlkLCAweDQ1ZmQxOThmLCAweDRjZjAxMjgxLCAweGFiNmJjYjNiLCAweGEyNjZjMDM1LCAweGI5NzFkZDI3LCAweGIwN2NkNjI5LCAweDhmNWZlNzAzLCAweDg2NTJlYzBkLCAweDlkNDVmMTFmLCAweDk0NDhmYTExLCAweGUzMDM5MzRiLCAweGVhMGU5ODQ1LCAweGYxMTk4NTU3LCAweGY4MTQ4ZTU5LCAweGM3MzdiZjczLCAweGNlM2FiNDdkLCAweGQ1MmRhOTZmLCAweGRjMjBhMjYxLCAweDc2NmRmNmFkLCAweDdmNjBmZGEzLCAweDY0NzdlMGIxLCAweDZkN2FlYmJmLCAweDUyNTlkYTk1LCAweDViNTRkMTliLCAweDQwNDNjYzg5LCAweDQ5NGVjNzg3LCAweDNlMDVhZWRkLCAweDM3MDhhNWQzLCAweDJjMWZiOGMxLCAweDI1MTJiM2NmLCAweDFhMzE4MmU1LCAweDEzM2M4OWViLCAweDA4MmI5NGY5LCAweDAxMjY5ZmY3LCAweGU2YmQ0NjRkLCAweGVmYjA0ZDQzLCAweGY0YTc1MDUxLCAweGZkYWE1YjVmLCAweGMyODk2YTc1LCAweGNiODQ2MTdiLCAweGQwOTM3YzY5LCAweGQ5OWU3NzY3LCAweGFlZDUxZTNkLCAweGE3ZDgxNTMzLCAweGJjY2YwODIxLCAweGI1YzIwMzJmLCAweDhhZTEzMjA1LCAweDgzZWMzOTBiLCAweDk4ZmIyNDE5LCAweDkxZjYyZjE3LCAweDRkZDY4ZDc2LCAweDQ0ZGI4Njc4LCAweDVmY2M5YjZhLCAweDU2YzE5MDY0LCAweDY5ZTJhMTRlLCAweDYwZWZhYTQwLCAweDdiZjhiNzUyLCAweDcyZjViYzVjLCAweDA1YmVkNTA2LCAweDBjYjNkZTA4LCAweDE3YTRjMzFhLCAweDFlYTljODE0LCAweDIxOGFmOTNlLCAweDI4ODdmMjMwLCAweDMzOTBlZjIyLCAweDNhOWRlNDJjLCAweGRkMDYzZDk2LCAweGQ0MGIzNjk4LCAweGNmMWMyYjhhLCAweGM2MTEyMDg0LCAweGY5MzIxMWFlLCAweGYwM2YxYWEwLCAweGViMjgwN2IyLCAweGUyMjUwY2JjLCAweDk1NmU2NWU2LCAweDljNjM2ZWU4LCAweDg3NzQ3M2ZhLCAweDhlNzk3OGY0LCAweGIxNWE0OWRlLCAweGI4NTc0MmQwLCAweGEzNDA1ZmMyLCAweGFhNGQ1NGNjLCAweGVjZGFmNzQxLCAweGU1ZDdmYzRmLCAweGZlYzBlMTVkLCAweGY3Y2RlYTUzLCAweGM4ZWVkYjc5LCAweGMxZTNkMDc3LCAweGRhZjRjZDY1LCAweGQzZjljNjZiLCAweGE0YjJhZjMxLCAweGFkYmZhNDNmLCAweGI2YThiOTJkLCAweGJmYTViMjIzLCAweDgwODY4MzA5LCAweDg5OGI4ODA3LCAweDkyOWM5NTE1LCAweDliOTE5ZTFiLCAweDdjMGE0N2ExLCAweDc1MDc0Y2FmLCAweDZlMTA1MWJkLCAweDY3MWQ1YWIzLCAweDU4M2U2Yjk5LCAweDUxMzM2MDk3LCAweDRhMjQ3ZDg1LCAweDQzMjk3NjhiLCAweDM0NjIxZmQxLCAweDNkNmYxNGRmLCAweDI2NzgwOWNkLCAweDJmNzUwMmMzLCAweDEwNTYzM2U5LCAweDE5NWIzOGU3LCAweDAyNGMyNWY1LCAweDBiNDEyZWZiLCAweGQ3NjE4YzlhLCAweGRlNmM4Nzk0LCAweGM1N2I5YTg2LCAweGNjNzY5MTg4LCAweGYzNTVhMGEyLCAweGZhNThhYmFjLCAweGUxNGZiNmJlLCAweGU4NDJiZGIwLCAweDlmMDlkNGVhLCAweDk2MDRkZmU0LCAweDhkMTNjMmY2LCAweDg0MWVjOWY4LCAweGJiM2RmOGQyLCAweGIyMzBmM2RjLCAweGE5MjdlZWNlLCAweGEwMmFlNWMwLCAweDQ3YjEzYzdhLCAweDRlYmMzNzc0LCAweDU1YWIyYTY2LCAweDVjYTYyMTY4LCAweDYzODUxMDQyLCAweDZhODgxYjRjLCAweDcxOWYwNjVlLCAweDc4OTIwZDUwLCAweDBmZDk2NDBhLCAweDA2ZDQ2ZjA0LCAweDFkYzM3MjE2LCAweDE0Y2U3OTE4LCAweDJiZWQ0ODMyLCAweDIyZTA0MzNjLCAweDM5Zjc1ZTJlLCAweDMwZmE1NTIwLCAweDlhYjcwMWVjLCAweDkzYmEwYWUyLCAweDg4YWQxN2YwLCAweDgxYTAxY2ZlLCAweGJlODMyZGQ0LCAweGI3OGUyNmRhLCAweGFjOTkzYmM4LCAweGE1OTQzMGM2LCAweGQyZGY1OTljLCAweGRiZDI1MjkyLCAweGMwYzU0ZjgwLCAweGM5Yzg0NDhlLCAweGY2ZWI3NWE0LCAweGZmZTY3ZWFhLCAweGU0ZjE2M2I4LCAweGVkZmM2OGI2LCAweDBhNjdiMTBjLCAweDAzNmFiYTAyLCAweDE4N2RhNzEwLCAweDExNzBhYzFlLCAweDJlNTM5ZDM0LCAweDI3NWU5NjNhLCAweDNjNDk4YjI4LCAweDM1NDQ4MDI2LCAweDQyMGZlOTdjLCAweDRiMDJlMjcyLCAweDUwMTVmZjYwLCAweDU5MThmNDZlLCAweDY2M2JjNTQ0LCAweDZmMzZjZTRhLCAweDc0MjFkMzU4LCAweDdkMmNkODU2LCAweGExMGM3YTM3LCAweGE4MDE3MTM5LCAweGIzMTY2YzJiLCAweGJhMWI2NzI1LCAweDg1Mzg1NjBmLCAweDhjMzU1ZDAxLCAweDk3MjI0MDEzLCAweDllMmY0YjFkLCAweGU5NjQyMjQ3LCAweGUwNjkyOTQ5LCAweGZiN2UzNDViLCAweGYyNzMzZjU1LCAweGNkNTAwZTdmLCAweGM0NWQwNTcxLCAweGRmNGExODYzLCAweGQ2NDcxMzZkLCAweDMxZGNjYWQ3LCAweDM4ZDFjMWQ5LCAweDIzYzZkY2NiLCAweDJhY2JkN2M1LCAweDE1ZThlNmVmLCAweDFjZTVlZGUxLCAweDA3ZjJmMGYzLCAweDBlZmZmYmZkLCAweDc5YjQ5MmE3LCAweDcwYjk5OWE5LCAweDZiYWU4NGJiLCAweDYyYTM4ZmI1LCAweDVkODBiZTlmLCAweDU0OGRiNTkxLCAweDRmOWFhODgzLCAweDQ2OTdhMzhkXTtcblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRUb0ludDMyKGJ5dGVzKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gNCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgKGJ5dGVzW2kgICAgXSA8PCAyNCkgfFxuICAgICAgICAgICAgICAgIChieXRlc1tpICsgMV0gPDwgMTYpIHxcbiAgICAgICAgICAgICAgICAoYnl0ZXNbaSArIDJdIDw8ICA4KSB8XG4gICAgICAgICAgICAgICAgIGJ5dGVzW2kgKyAzXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHZhciBBRVMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEFFUykpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdrZXknLCB7XG4gICAgICAgICAgICB2YWx1ZTogY29lcmNlQXJyYXkoa2V5LCB0cnVlKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9wcmVwYXJlKCk7XG4gICAgfVxuXG5cbiAgICBBRVMucHJvdG90eXBlLl9wcmVwYXJlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHJvdW5kcyA9IG51bWJlck9mUm91bmRzW3RoaXMua2V5Lmxlbmd0aF07XG4gICAgICAgIGlmIChyb3VuZHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGtleSBzaXplIChtdXN0IGJlIDE2LCAyNCBvciAzMiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVuY3J5cHRpb24gcm91bmQga2V5c1xuICAgICAgICB0aGlzLl9LZSA9IFtdO1xuXG4gICAgICAgIC8vIGRlY3J5cHRpb24gcm91bmQga2V5c1xuICAgICAgICB0aGlzLl9LZCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHJvdW5kczsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9LZS5wdXNoKFswLCAwLCAwLCAwXSk7XG4gICAgICAgICAgICB0aGlzLl9LZC5wdXNoKFswLCAwLCAwLCAwXSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcm91bmRLZXlDb3VudCA9IChyb3VuZHMgKyAxKSAqIDQ7XG4gICAgICAgIHZhciBLQyA9IHRoaXMua2V5Lmxlbmd0aCAvIDQ7XG5cbiAgICAgICAgLy8gY29udmVydCB0aGUga2V5IGludG8gaW50c1xuICAgICAgICB2YXIgdGsgPSBjb252ZXJ0VG9JbnQzMih0aGlzLmtleSk7XG5cbiAgICAgICAgLy8gY29weSB2YWx1ZXMgaW50byByb3VuZCBrZXkgYXJyYXlzXG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBLQzsgaSsrKSB7XG4gICAgICAgICAgICBpbmRleCA9IGkgPj4gMjtcbiAgICAgICAgICAgIHRoaXMuX0tlW2luZGV4XVtpICUgNF0gPSB0a1tpXTtcbiAgICAgICAgICAgIHRoaXMuX0tkW3JvdW5kcyAtIGluZGV4XVtpICUgNF0gPSB0a1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGtleSBleHBhbnNpb24gKGZpcHMtMTk3IHNlY3Rpb24gNS4yKVxuICAgICAgICB2YXIgcmNvbnBvaW50ZXIgPSAwO1xuICAgICAgICB2YXIgdCA9IEtDLCB0dDtcbiAgICAgICAgd2hpbGUgKHQgPCByb3VuZEtleUNvdW50KSB7XG4gICAgICAgICAgICB0dCA9IHRrW0tDIC0gMV07XG4gICAgICAgICAgICB0a1swXSBePSAoKFNbKHR0ID4+IDE2KSAmIDB4RkZdIDw8IDI0KSBeXG4gICAgICAgICAgICAgICAgICAgICAgKFNbKHR0ID4+ICA4KSAmIDB4RkZdIDw8IDE2KSBeXG4gICAgICAgICAgICAgICAgICAgICAgKFNbIHR0ICAgICAgICAmIDB4RkZdIDw8ICA4KSBeXG4gICAgICAgICAgICAgICAgICAgICAgIFNbKHR0ID4+IDI0KSAmIDB4RkZdICAgICAgICBeXG4gICAgICAgICAgICAgICAgICAgICAgKHJjb25bcmNvbnBvaW50ZXJdIDw8IDI0KSk7XG4gICAgICAgICAgICByY29ucG9pbnRlciArPSAxO1xuXG4gICAgICAgICAgICAvLyBrZXkgZXhwYW5zaW9uIChmb3Igbm9uLTI1NiBiaXQpXG4gICAgICAgICAgICBpZiAoS0MgIT0gOCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgS0M7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0a1tpXSBePSB0a1tpIC0gMV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBrZXkgZXhwYW5zaW9uIGZvciAyNTYtYml0IGtleXMgaXMgXCJzbGlnaHRseSBkaWZmZXJlbnRcIiAoZmlwcy0xOTcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgKEtDIC8gMik7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0a1tpXSBePSB0a1tpIC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHR0ID0gdGtbKEtDIC8gMikgLSAxXTtcblxuICAgICAgICAgICAgICAgIHRrW0tDIC8gMl0gXj0gKFNbIHR0ICAgICAgICAmIDB4RkZdICAgICAgICBeXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoU1sodHQgPj4gIDgpICYgMHhGRl0gPDwgIDgpIF5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChTWyh0dCA+PiAxNikgJiAweEZGXSA8PCAxNikgXlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFNbKHR0ID4+IDI0KSAmIDB4RkZdIDw8IDI0KSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gKEtDIC8gMikgKyAxOyBpIDwgS0M7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0a1tpXSBePSB0a1tpIC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb3B5IHZhbHVlcyBpbnRvIHJvdW5kIGtleSBhcnJheXNcbiAgICAgICAgICAgIHZhciBpID0gMCwgciwgYztcbiAgICAgICAgICAgIHdoaWxlIChpIDwgS0MgJiYgdCA8IHJvdW5kS2V5Q291bnQpIHtcbiAgICAgICAgICAgICAgICByID0gdCA+PiAyO1xuICAgICAgICAgICAgICAgIGMgPSB0ICUgNDtcbiAgICAgICAgICAgICAgICB0aGlzLl9LZVtyXVtjXSA9IHRrW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuX0tkW3JvdW5kcyAtIHJdW2NdID0gdGtbaSsrXTtcbiAgICAgICAgICAgICAgICB0Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnZlcnNlLWNpcGhlci1pZnkgdGhlIGRlY3J5cHRpb24gcm91bmQga2V5IChmaXBzLTE5NyBzZWN0aW9uIDUuMylcbiAgICAgICAgZm9yICh2YXIgciA9IDE7IHIgPCByb3VuZHM7IHIrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCA0OyBjKyspIHtcbiAgICAgICAgICAgICAgICB0dCA9IHRoaXMuX0tkW3JdW2NdO1xuICAgICAgICAgICAgICAgIHRoaXMuX0tkW3JdW2NdID0gKFUxWyh0dCA+PiAyNCkgJiAweEZGXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVTJbKHR0ID4+IDE2KSAmIDB4RkZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVM1sodHQgPj4gIDgpICYgMHhGRl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFU0WyB0dCAgICAgICAgJiAweEZGXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBBRVMucHJvdG90eXBlLmVuY3J5cHQgPSBmdW5jdGlvbihwbGFpbnRleHQpIHtcbiAgICAgICAgaWYgKHBsYWludGV4dC5sZW5ndGggIT0gMTYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwbGFpbnRleHQgc2l6ZSAobXVzdCBiZSAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByb3VuZHMgPSB0aGlzLl9LZS5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgYSA9IFswLCAwLCAwLCAwXTtcblxuICAgICAgICAvLyBjb252ZXJ0IHBsYWludGV4dCB0byAoaW50cyBeIGtleSlcbiAgICAgICAgdmFyIHQgPSBjb252ZXJ0VG9JbnQzMihwbGFpbnRleHQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgdFtpXSBePSB0aGlzLl9LZVswXVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFwcGx5IHJvdW5kIHRyYW5zZm9ybXNcbiAgICAgICAgZm9yICh2YXIgciA9IDE7IHIgPCByb3VuZHM7IHIrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gKFQxWyh0WyBpICAgICAgICAgXSA+PiAyNCkgJiAweGZmXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICBUMlsodFsoaSArIDEpICUgNF0gPj4gMTYpICYgMHhmZl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgVDNbKHRbKGkgKyAyKSAlIDRdID4+ICA4KSAmIDB4ZmZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgIFQ0WyB0WyhpICsgMykgJSA0XSAgICAgICAgJiAweGZmXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9LZVtyXVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ID0gYS5zbGljZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhlIGxhc3Qgcm91bmQgaXMgc3BlY2lhbFxuICAgICAgICB2YXIgcmVzdWx0ID0gY3JlYXRlQXJyYXkoMTYpLCB0dDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHR0ID0gdGhpcy5fS2Vbcm91bmRzXVtpXTtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSAgICBdID0gKFNbKHRbIGkgICAgICAgICBdID4+IDI0KSAmIDB4ZmZdIF4gKHR0ID4+IDI0KSkgJiAweGZmO1xuICAgICAgICAgICAgcmVzdWx0WzQgKiBpICsgMV0gPSAoU1sodFsoaSArIDEpICUgNF0gPj4gMTYpICYgMHhmZl0gXiAodHQgPj4gMTYpKSAmIDB4ZmY7XG4gICAgICAgICAgICByZXN1bHRbNCAqIGkgKyAyXSA9IChTWyh0WyhpICsgMikgJSA0XSA+PiAgOCkgJiAweGZmXSBeICh0dCA+PiAgOCkpICYgMHhmZjtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSArIDNdID0gKFNbIHRbKGkgKyAzKSAlIDRdICAgICAgICAmIDB4ZmZdIF4gIHR0ICAgICAgICkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBBRVMucHJvdG90eXBlLmRlY3J5cHQgPSBmdW5jdGlvbihjaXBoZXJ0ZXh0KSB7XG4gICAgICAgIGlmIChjaXBoZXJ0ZXh0Lmxlbmd0aCAhPSAxNikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByb3VuZHMgPSB0aGlzLl9LZC5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgYSA9IFswLCAwLCAwLCAwXTtcblxuICAgICAgICAvLyBjb252ZXJ0IHBsYWludGV4dCB0byAoaW50cyBeIGtleSlcbiAgICAgICAgdmFyIHQgPSBjb252ZXJ0VG9JbnQzMihjaXBoZXJ0ZXh0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRbaV0gXj0gdGhpcy5fS2RbMF1baV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcHBseSByb3VuZCB0cmFuc2Zvcm1zXG4gICAgICAgIGZvciAodmFyIHIgPSAxOyByIDwgcm91bmRzOyByKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IChUNVsodFsgaSAgICAgICAgICBdID4+IDI0KSAmIDB4ZmZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgIFQ2Wyh0WyhpICsgMykgJSA0XSA+PiAxNikgJiAweGZmXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICBUN1sodFsoaSArIDIpICUgNF0gPj4gIDgpICYgMHhmZl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgVDhbIHRbKGkgKyAxKSAlIDRdICAgICAgICAmIDB4ZmZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX0tkW3JdW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQgPSBhLnNsaWNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGUgbGFzdCByb3VuZCBpcyBzcGVjaWFsXG4gICAgICAgIHZhciByZXN1bHQgPSBjcmVhdGVBcnJheSgxNiksIHR0O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgdHQgPSB0aGlzLl9LZFtyb3VuZHNdW2ldO1xuICAgICAgICAgICAgcmVzdWx0WzQgKiBpICAgIF0gPSAoU2lbKHRbIGkgICAgICAgICBdID4+IDI0KSAmIDB4ZmZdIF4gKHR0ID4+IDI0KSkgJiAweGZmO1xuICAgICAgICAgICAgcmVzdWx0WzQgKiBpICsgMV0gPSAoU2lbKHRbKGkgKyAzKSAlIDRdID4+IDE2KSAmIDB4ZmZdIF4gKHR0ID4+IDE2KSkgJiAweGZmO1xuICAgICAgICAgICAgcmVzdWx0WzQgKiBpICsgMl0gPSAoU2lbKHRbKGkgKyAyKSAlIDRdID4+ICA4KSAmIDB4ZmZdIF4gKHR0ID4+ICA4KSkgJiAweGZmO1xuICAgICAgICAgICAgcmVzdWx0WzQgKiBpICsgM10gPSAoU2lbIHRbKGkgKyAxKSAlIDRdICAgICAgICAmIDB4ZmZdIF4gIHR0ICAgICAgICkgJiAweGZmO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICBNb2RlIE9mIE9wZXJhdGlvbiAtIEVsZWN0b25pYyBDb2RlYm9vayAoRUNCKVxuICAgICAqL1xuICAgIHZhciBNb2RlT2ZPcGVyYXRpb25FQ0IgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbkVDQikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiRWxlY3Ryb25pYyBDb2RlIEJsb2NrXCI7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiZWNiXCI7XG5cbiAgICAgICAgdGhpcy5fYWVzID0gbmV3IEFFUyhrZXkpO1xuICAgIH1cblxuICAgIE1vZGVPZk9wZXJhdGlvbkVDQi5wcm90b3R5cGUuZW5jcnlwdCA9IGZ1bmN0aW9uKHBsYWludGV4dCkge1xuICAgICAgICBwbGFpbnRleHQgPSBjb2VyY2VBcnJheShwbGFpbnRleHQpO1xuXG4gICAgICAgIGlmICgocGxhaW50ZXh0Lmxlbmd0aCAlIDE2KSAhPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNpcGhlcnRleHQgPSBjcmVhdGVBcnJheShwbGFpbnRleHQubGVuZ3RoKTtcbiAgICAgICAgdmFyIGJsb2NrID0gY3JlYXRlQXJyYXkoMTYpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhaW50ZXh0Lmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgICAgICAgY29weUFycmF5KHBsYWludGV4dCwgYmxvY2ssIDAsIGksIGkgKyAxNik7XG4gICAgICAgICAgICBibG9jayA9IHRoaXMuX2Flcy5lbmNyeXB0KGJsb2NrKTtcbiAgICAgICAgICAgIGNvcHlBcnJheShibG9jaywgY2lwaGVydGV4dCwgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2lwaGVydGV4dDtcbiAgICB9XG5cbiAgICBNb2RlT2ZPcGVyYXRpb25FQ0IucHJvdG90eXBlLmRlY3J5cHQgPSBmdW5jdGlvbihjaXBoZXJ0ZXh0KSB7XG4gICAgICAgIGNpcGhlcnRleHQgPSBjb2VyY2VBcnJheShjaXBoZXJ0ZXh0KTtcblxuICAgICAgICBpZiAoKGNpcGhlcnRleHQubGVuZ3RoICUgMTYpICE9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2lwaGVydGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBsYWludGV4dCA9IGNyZWF0ZUFycmF5KGNpcGhlcnRleHQubGVuZ3RoKTtcbiAgICAgICAgdmFyIGJsb2NrID0gY3JlYXRlQXJyYXkoMTYpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2lwaGVydGV4dC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgICAgIGNvcHlBcnJheShjaXBoZXJ0ZXh0LCBibG9jaywgMCwgaSwgaSArIDE2KTtcbiAgICAgICAgICAgIGJsb2NrID0gdGhpcy5fYWVzLmRlY3J5cHQoYmxvY2spO1xuICAgICAgICAgICAgY29weUFycmF5KGJsb2NrLCBwbGFpbnRleHQsIGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYWludGV4dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICBNb2RlIE9mIE9wZXJhdGlvbiAtIENpcGhlciBCbG9jayBDaGFpbmluZyAoQ0JDKVxuICAgICAqL1xuICAgIHZhciBNb2RlT2ZPcGVyYXRpb25DQkMgPSBmdW5jdGlvbihrZXksIGl2KSB7XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RlT2ZPcGVyYXRpb25DQkMpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIkNpcGhlciBCbG9jayBDaGFpbmluZ1wiO1xuICAgICAgICB0aGlzLm5hbWUgPSBcImNiY1wiO1xuXG4gICAgICAgIGlmICghaXYpIHtcbiAgICAgICAgICAgIGl2ID0gY3JlYXRlQXJyYXkoMTYpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoaXYubGVuZ3RoICE9IDE2KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgaW5pdGlhbGF0aW9uIHZlY3RvciBzaXplIChtdXN0IGJlIDE2IGJ5dGVzKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbGFzdENpcGhlcmJsb2NrID0gY29lcmNlQXJyYXkoaXYsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuX2FlcyA9IG5ldyBBRVMoa2V5KTtcbiAgICB9XG5cbiAgICBNb2RlT2ZPcGVyYXRpb25DQkMucHJvdG90eXBlLmVuY3J5cHQgPSBmdW5jdGlvbihwbGFpbnRleHQpIHtcbiAgICAgICAgcGxhaW50ZXh0ID0gY29lcmNlQXJyYXkocGxhaW50ZXh0KTtcblxuICAgICAgICBpZiAoKHBsYWludGV4dC5sZW5ndGggJSAxNikgIT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwbGFpbnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaXBoZXJ0ZXh0ID0gY3JlYXRlQXJyYXkocGxhaW50ZXh0Lmxlbmd0aCk7XG4gICAgICAgIHZhciBibG9jayA9IGNyZWF0ZUFycmF5KDE2KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsYWludGV4dC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgICAgIGNvcHlBcnJheShwbGFpbnRleHQsIGJsb2NrLCAwLCBpLCBpICsgMTYpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDE2OyBqKyspIHtcbiAgICAgICAgICAgICAgICBibG9ja1tqXSBePSB0aGlzLl9sYXN0Q2lwaGVyYmxvY2tbal07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2xhc3RDaXBoZXJibG9jayA9IHRoaXMuX2Flcy5lbmNyeXB0KGJsb2NrKTtcbiAgICAgICAgICAgIGNvcHlBcnJheSh0aGlzLl9sYXN0Q2lwaGVyYmxvY2ssIGNpcGhlcnRleHQsIGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNpcGhlcnRleHQ7XG4gICAgfVxuXG4gICAgTW9kZU9mT3BlcmF0aW9uQ0JDLnByb3RvdHlwZS5kZWNyeXB0ID0gZnVuY3Rpb24oY2lwaGVydGV4dCkge1xuICAgICAgICBjaXBoZXJ0ZXh0ID0gY29lcmNlQXJyYXkoY2lwaGVydGV4dCk7XG5cbiAgICAgICAgaWYgKChjaXBoZXJ0ZXh0Lmxlbmd0aCAlIDE2KSAhPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwbGFpbnRleHQgPSBjcmVhdGVBcnJheShjaXBoZXJ0ZXh0Lmxlbmd0aCk7XG4gICAgICAgIHZhciBibG9jayA9IGNyZWF0ZUFycmF5KDE2KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNpcGhlcnRleHQubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgICAgICAgICBjb3B5QXJyYXkoY2lwaGVydGV4dCwgYmxvY2ssIDAsIGksIGkgKyAxNik7XG4gICAgICAgICAgICBibG9jayA9IHRoaXMuX2Flcy5kZWNyeXB0KGJsb2NrKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAxNjsgaisrKSB7XG4gICAgICAgICAgICAgICAgcGxhaW50ZXh0W2kgKyBqXSA9IGJsb2NrW2pdIF4gdGhpcy5fbGFzdENpcGhlcmJsb2NrW2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3B5QXJyYXkoY2lwaGVydGV4dCwgdGhpcy5fbGFzdENpcGhlcmJsb2NrLCAwLCBpLCBpICsgMTYpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYWludGV4dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqICBNb2RlIE9mIE9wZXJhdGlvbiAtIENpcGhlciBGZWVkYmFjayAoQ0ZCKVxuICAgICAqL1xuICAgIHZhciBNb2RlT2ZPcGVyYXRpb25DRkIgPSBmdW5jdGlvbihrZXksIGl2LCBzZWdtZW50U2l6ZSkge1xuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ0ZCKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0FFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDaXBoZXIgRmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJjZmJcIjtcblxuICAgICAgICBpZiAoIWl2KSB7XG4gICAgICAgICAgICBpdiA9IGNyZWF0ZUFycmF5KDE2KTtcblxuICAgICAgICB9IGVsc2UgaWYgKGl2Lmxlbmd0aCAhPSAxNikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBzaXplKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWdtZW50U2l6ZSkgeyBzZWdtZW50U2l6ZSA9IDE7IH1cblxuICAgICAgICB0aGlzLnNlZ21lbnRTaXplID0gc2VnbWVudFNpemU7XG5cbiAgICAgICAgdGhpcy5fc2hpZnRSZWdpc3RlciA9IGNvZXJjZUFycmF5KGl2LCB0cnVlKTtcblxuICAgICAgICB0aGlzLl9hZXMgPSBuZXcgQUVTKGtleSk7XG4gICAgfVxuXG4gICAgTW9kZU9mT3BlcmF0aW9uQ0ZCLnByb3RvdHlwZS5lbmNyeXB0ID0gZnVuY3Rpb24ocGxhaW50ZXh0KSB7XG4gICAgICAgIGlmICgocGxhaW50ZXh0Lmxlbmd0aCAlIHRoaXMuc2VnbWVudFNpemUpICE9IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwbGFpbnRleHQgc2l6ZSAobXVzdCBiZSBzZWdtZW50U2l6ZSBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbmNyeXB0ZWQgPSBjb2VyY2VBcnJheShwbGFpbnRleHQsIHRydWUpO1xuXG4gICAgICAgIHZhciB4b3JTZWdtZW50O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuY3J5cHRlZC5sZW5ndGg7IGkgKz0gdGhpcy5zZWdtZW50U2l6ZSkge1xuICAgICAgICAgICAgeG9yU2VnbWVudCA9IHRoaXMuX2Flcy5lbmNyeXB0KHRoaXMuX3NoaWZ0UmVnaXN0ZXIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLnNlZ21lbnRTaXplOyBqKyspIHtcbiAgICAgICAgICAgICAgICBlbmNyeXB0ZWRbaSArIGpdIF49IHhvclNlZ21lbnRbal07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNoaWZ0IHRoZSByZWdpc3RlclxuICAgICAgICAgICAgY29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsIHRoaXMuX3NoaWZ0UmVnaXN0ZXIsIDAsIHRoaXMuc2VnbWVudFNpemUpO1xuICAgICAgICAgICAgY29weUFycmF5KGVuY3J5cHRlZCwgdGhpcy5fc2hpZnRSZWdpc3RlciwgMTYgLSB0aGlzLnNlZ21lbnRTaXplLCBpLCBpICsgdGhpcy5zZWdtZW50U2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW5jcnlwdGVkO1xuICAgIH1cblxuICAgIE1vZGVPZk9wZXJhdGlvbkNGQi5wcm90b3R5cGUuZGVjcnlwdCA9IGZ1bmN0aW9uKGNpcGhlcnRleHQpIHtcbiAgICAgICAgaWYgKChjaXBoZXJ0ZXh0Lmxlbmd0aCAlIHRoaXMuc2VnbWVudFNpemUpICE9IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaXBoZXJ0ZXh0IHNpemUgKG11c3QgYmUgc2VnbWVudFNpemUgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGxhaW50ZXh0ID0gY29lcmNlQXJyYXkoY2lwaGVydGV4dCwgdHJ1ZSk7XG5cbiAgICAgICAgdmFyIHhvclNlZ21lbnQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhaW50ZXh0Lmxlbmd0aDsgaSArPSB0aGlzLnNlZ21lbnRTaXplKSB7XG4gICAgICAgICAgICB4b3JTZWdtZW50ID0gdGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5zZWdtZW50U2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgcGxhaW50ZXh0W2kgKyBqXSBePSB4b3JTZWdtZW50W2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaGlmdCB0aGUgcmVnaXN0ZXJcbiAgICAgICAgICAgIGNvcHlBcnJheSh0aGlzLl9zaGlmdFJlZ2lzdGVyLCB0aGlzLl9zaGlmdFJlZ2lzdGVyLCAwLCB0aGlzLnNlZ21lbnRTaXplKTtcbiAgICAgICAgICAgIGNvcHlBcnJheShjaXBoZXJ0ZXh0LCB0aGlzLl9zaGlmdFJlZ2lzdGVyLCAxNiAtIHRoaXMuc2VnbWVudFNpemUsIGksIGkgKyB0aGlzLnNlZ21lbnRTaXplKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGFpbnRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIE1vZGUgT2YgT3BlcmF0aW9uIC0gT3V0cHV0IEZlZWRiYWNrIChPRkIpXG4gICAgICovXG4gICAgdmFyIE1vZGVPZk9wZXJhdGlvbk9GQiA9IGZ1bmN0aW9uKGtleSwgaXYpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbk9GQikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiT3V0cHV0IEZlZWRiYWNrXCI7XG4gICAgICAgIHRoaXMubmFtZSA9IFwib2ZiXCI7XG5cbiAgICAgICAgaWYgKCFpdikge1xuICAgICAgICAgICAgaXYgPSBjcmVhdGVBcnJheSgxNik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChpdi5sZW5ndGggIT0gMTYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBpbml0aWFsYXRpb24gdmVjdG9yIHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYXN0UHJlY2lwaGVyID0gY29lcmNlQXJyYXkoaXYsIHRydWUpO1xuICAgICAgICB0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXggPSAxNjtcblxuICAgICAgICB0aGlzLl9hZXMgPSBuZXcgQUVTKGtleSk7XG4gICAgfVxuXG4gICAgTW9kZU9mT3BlcmF0aW9uT0ZCLnByb3RvdHlwZS5lbmNyeXB0ID0gZnVuY3Rpb24ocGxhaW50ZXh0KSB7XG4gICAgICAgIHZhciBlbmNyeXB0ZWQgPSBjb2VyY2VBcnJheShwbGFpbnRleHQsIHRydWUpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5jcnlwdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGFzdFByZWNpcGhlckluZGV4ID09PSAxNikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RQcmVjaXBoZXIgPSB0aGlzLl9hZXMuZW5jcnlwdCh0aGlzLl9sYXN0UHJlY2lwaGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5jcnlwdGVkW2ldIF49IHRoaXMuX2xhc3RQcmVjaXBoZXJbdGhpcy5fbGFzdFByZWNpcGhlckluZGV4KytdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVuY3J5cHRlZDtcbiAgICB9XG5cbiAgICAvLyBEZWNyeXB0aW9uIGlzIHN5bWV0cmljXG4gICAgTW9kZU9mT3BlcmF0aW9uT0ZCLnByb3RvdHlwZS5kZWNyeXB0ID0gTW9kZU9mT3BlcmF0aW9uT0ZCLnByb3RvdHlwZS5lbmNyeXB0O1xuXG5cbiAgICAvKipcbiAgICAgKiAgQ291bnRlciBvYmplY3QgZm9yIENUUiBjb21tb24gbW9kZSBvZiBvcGVyYXRpb25cbiAgICAgKi9cbiAgICB2YXIgQ291bnRlciA9IGZ1bmN0aW9uKGluaXRpYWxWYWx1ZSkge1xuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ291bnRlcikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdDb3VudGVyIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGFsbG93IDAsIGJ1dCBhbnl0aGluZyBmYWxzZS1pc2ggdXNlcyB0aGUgZGVmYXVsdCAxXG4gICAgICAgIGlmIChpbml0aWFsVmFsdWUgIT09IDAgJiYgIWluaXRpYWxWYWx1ZSkgeyBpbml0aWFsVmFsdWUgPSAxOyB9XG5cbiAgICAgICAgaWYgKHR5cGVvZihpbml0aWFsVmFsdWUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IGNyZWF0ZUFycmF5KDE2KTtcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoaW5pdGlhbFZhbHVlKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRCeXRlcyhpbml0aWFsVmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQ291bnRlci5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mKHZhbHVlKSAhPT0gJ251bWJlcicgfHwgcGFyc2VJbnQodmFsdWUpICE9IHZhbHVlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY291bnRlciB2YWx1ZSAobXVzdCBiZSBhbiBpbnRlZ2VyKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgY2Fubm90IHNhZmVseSBoYW5kbGUgbnVtYmVycyBiZXlvbmQgdGhlIHNhZmUgcmFuZ2UgZm9yIGludGVnZXJzXG4gICAgICAgIGlmICh2YWx1ZSA+IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludGVnZXIgdmFsdWUgb3V0IG9mIHNhZmUgcmFuZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMTU7IGluZGV4ID49IDA7IC0taW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXJbaW5kZXhdID0gdmFsdWUgJSAyNTY7XG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlIC8gMjU2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIENvdW50ZXIucHJvdG90eXBlLnNldEJ5dGVzID0gZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgICAgYnl0ZXMgPSBjb2VyY2VBcnJheShieXRlcywgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGJ5dGVzLmxlbmd0aCAhPSAxNikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNvdW50ZXIgYnl0ZXMgc2l6ZSAobXVzdCBiZSAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvdW50ZXIgPSBieXRlcztcbiAgICB9O1xuXG4gICAgQ291bnRlci5wcm90b3R5cGUuaW5jcmVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxNTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb3VudGVyW2ldID09PSAyNTUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudGVyW2ldID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnRlcltpXSsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAgTW9kZSBPZiBPcGVyYXRpb24gLSBDb3VudGVyIChDVFIpXG4gICAgICovXG4gICAgdmFyIE1vZGVPZk9wZXJhdGlvbkNUUiA9IGZ1bmN0aW9uKGtleSwgY291bnRlcikge1xuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ1RSKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0FFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDb3VudGVyXCI7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiY3RyXCI7XG5cbiAgICAgICAgaWYgKCEoY291bnRlciBpbnN0YW5jZW9mIENvdW50ZXIpKSB7XG4gICAgICAgICAgICBjb3VudGVyID0gbmV3IENvdW50ZXIoY291bnRlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvdW50ZXIgPSBjb3VudGVyO1xuXG4gICAgICAgIHRoaXMuX3JlbWFpbmluZ0NvdW50ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZW1haW5pbmdDb3VudGVySW5kZXggPSAxNjtcblxuICAgICAgICB0aGlzLl9hZXMgPSBuZXcgQUVTKGtleSk7XG4gICAgfVxuXG4gICAgTW9kZU9mT3BlcmF0aW9uQ1RSLnByb3RvdHlwZS5lbmNyeXB0ID0gZnVuY3Rpb24ocGxhaW50ZXh0KSB7XG4gICAgICAgIHZhciBlbmNyeXB0ZWQgPSBjb2VyY2VBcnJheShwbGFpbnRleHQsIHRydWUpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5jcnlwdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4ID09PSAxNikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbWFpbmluZ0NvdW50ZXIgPSB0aGlzLl9hZXMuZW5jcnlwdCh0aGlzLl9jb3VudGVyLl9jb3VudGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1haW5pbmdDb3VudGVySW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIuaW5jcmVtZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbmNyeXB0ZWRbaV0gXj0gdGhpcy5fcmVtYWluaW5nQ291bnRlclt0aGlzLl9yZW1haW5pbmdDb3VudGVySW5kZXgrK107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW5jcnlwdGVkO1xuICAgIH1cblxuICAgIC8vIERlY3J5cHRpb24gaXMgc3ltZXRyaWNcbiAgICBNb2RlT2ZPcGVyYXRpb25DVFIucHJvdG90eXBlLmRlY3J5cHQgPSBNb2RlT2ZPcGVyYXRpb25DVFIucHJvdG90eXBlLmVuY3J5cHQ7XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUGFkZGluZ1xuXG4gICAgLy8gU2VlOmh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyMzE1XG4gICAgZnVuY3Rpb24gcGtjczdwYWQoZGF0YSkge1xuICAgICAgICBkYXRhID0gY29lcmNlQXJyYXkoZGF0YSwgdHJ1ZSk7XG4gICAgICAgIHZhciBwYWRkZXIgPSAxNiAtIChkYXRhLmxlbmd0aCAlIDE2KTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNyZWF0ZUFycmF5KGRhdGEubGVuZ3RoICsgcGFkZGVyKTtcbiAgICAgICAgY29weUFycmF5KGRhdGEsIHJlc3VsdCk7XG4gICAgICAgIGZvciAodmFyIGkgPSBkYXRhLmxlbmd0aDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0W2ldID0gcGFkZGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGtjczdzdHJpcChkYXRhKSB7XG4gICAgICAgIGRhdGEgPSBjb2VyY2VBcnJheShkYXRhLCB0cnVlKTtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoIDwgMTYpIHsgdGhyb3cgbmV3IEVycm9yKCdQS0NTIzcgaW52YWxpZCBsZW5ndGgnKTsgfVxuXG4gICAgICAgIHZhciBwYWRkZXIgPSBkYXRhW2RhdGEubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChwYWRkZXIgPiAxNikgeyB0aHJvdyBuZXcgRXJyb3IoJ1BLQ1MjNyBwYWRkaW5nIGJ5dGUgb3V0IG9mIHJhbmdlJyk7IH1cblxuICAgICAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggLSBwYWRkZXI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkZGVyOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2xlbmd0aCArIGldICE9PSBwYWRkZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BLQ1MjNyBpbnZhbGlkIHBhZGRpbmcgYnl0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IGNyZWF0ZUFycmF5KGxlbmd0aCk7XG4gICAgICAgIGNvcHlBcnJheShkYXRhLCByZXN1bHQsIDAsIDAsIGxlbmd0aCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBFeHBvcnRpbmdcblxuXG4gICAgLy8gVGhlIGJsb2NrIGNpcGhlclxuICAgIHZhciBhZXNqcyA9IHtcbiAgICAgICAgQUVTOiBBRVMsXG4gICAgICAgIENvdW50ZXI6IENvdW50ZXIsXG5cbiAgICAgICAgTW9kZU9mT3BlcmF0aW9uOiB7XG4gICAgICAgICAgICBlY2I6IE1vZGVPZk9wZXJhdGlvbkVDQixcbiAgICAgICAgICAgIGNiYzogTW9kZU9mT3BlcmF0aW9uQ0JDLFxuICAgICAgICAgICAgY2ZiOiBNb2RlT2ZPcGVyYXRpb25DRkIsXG4gICAgICAgICAgICBvZmI6IE1vZGVPZk9wZXJhdGlvbk9GQixcbiAgICAgICAgICAgIGN0cjogTW9kZU9mT3BlcmF0aW9uQ1RSXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXRpbHM6IHtcbiAgICAgICAgICAgIGhleDogY29udmVydEhleCxcbiAgICAgICAgICAgIHV0Zjg6IGNvbnZlcnRVdGY4XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFkZGluZzoge1xuICAgICAgICAgICAgcGtjczc6IHtcbiAgICAgICAgICAgICAgICBwYWQ6IHBrY3M3cGFkLFxuICAgICAgICAgICAgICAgIHN0cmlwOiBwa2NzN3N0cmlwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FycmF5VGVzdDoge1xuICAgICAgICAgICAgY29lcmNlQXJyYXk6IGNvZXJjZUFycmF5LFxuICAgICAgICAgICAgY3JlYXRlQXJyYXk6IGNyZWF0ZUFycmF5LFxuICAgICAgICAgICAgY29weUFycmF5OiBjb3B5QXJyYXksXG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvLyBub2RlLmpzXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGFlc2pzXG5cbiAgICAvLyBSZXF1aXJlSlMvQU1EXG4gICAgLy8gaHR0cDovL3d3dy5yZXF1aXJlanMub3JnL2RvY3MvYXBpLmh0bWxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW1kanMvYW1kanMtYXBpL3dpa2kvQU1EXG4gICAgfSBlbHNlIGlmICh0eXBlb2YoZGVmaW5lKSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7IHJldHVybiBhZXNqczsgfSk7XG5cbiAgICAvLyBXZWIgQnJvd3NlcnNcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIElmIHRoZXJlIHdhcyBhbiBleGlzdGluZyBsaWJyYXJ5IGF0IFwiYWVzanNcIiBtYWtlIHN1cmUgaXQncyBzdGlsbCBhdmFpbGFibGVcbiAgICAgICAgaWYgKHJvb3QuYWVzanMpIHtcbiAgICAgICAgICAgIGFlc2pzLl9hZXNqcyA9IHJvb3QuYWVzanM7XG4gICAgICAgIH1cblxuICAgICAgICByb290LmFlc2pzID0gYWVzanM7XG4gICAgfVxuXG5cbn0pKHRoaXMpO1xuIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikoZmFsc2UpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCI6cm9vdCB7XFxuICAtLWJhY2tncm91bmQtY29sb3I6ICMxYTFhMWE7XFxuICAtLXN1cmZhY2UtY29sb3I6ICMyYzJjMmM7XFxuICAtLXByaW1hcnktY29sb3I6ICNlNDM0MzQ7XFxuICAtLXByaW1hcnktaG92ZXItY29sb3I6ICNmZjQ4NDg7XFxuICAtLXRleHQtY29sb3I6ICNmMGYwZjA7XFxuICAtLXRleHQtbXV0ZWQtY29sb3I6ICM4ODg7XFxuICAtLWJvcmRlci1jb2xvcjogIzQ0NDtcXG4gIC0tZm9udC1mYW1pbHk6ICdJbnRlcicsIHNhbnMtc2VyaWY7XFxufVxcblxcbioge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuYm9keSwgaHRtbCB7XFxuICBtYXJnaW46IDA7IFxcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LWZhbWlseSk7XFxuICBmb250LXNpemU6IDE2cHg7IFxcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvcik7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxufVxcblxcbmJvZHkge1xcbiAgZGlzcGxheTogZ3JpZDsgXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBhZGRpbmc6IDIwcHg7XFxufVxcblxcbiN3cmFwcGVyIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWF4LXdpZHRoOiA4MDBweDsgXFxuICBtYXJnaW4tdG9wOiA0MHB4O1xcbiAgZGlzcGxheTogZ3JpZDsgXFxuICBnYXA6IDI1cHg7XFxufVxcblxcbmgxIHtcXG4gIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaDIge1xcbiAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xcbiAgbWFyZ2luLXRvcDogMDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO1xcbiAgcGFkZGluZy1ib3R0b206IDEwcHg7XFxufVxcblxcbi8qIC0tLSBJbnN0cnVjdGlvbnMgJiBUYWJsZSAtLS0gKi9cXG4uaW5zdHJ1Y3Rpb25zIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXN1cmZhY2UtY29sb3IpO1xcbiAgcGFkZGluZzogMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvcik7XFxufVxcblxcbi5zYXZlLWxvY2F0aW9ucy10YWJsZSB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBtYXJnaW46IDE1cHggMDtcXG59XFxuXFxuLnNhdmUtbG9jYXRpb25zLXRhYmxlIHRoLCAuc2F2ZS1sb2NhdGlvbnMtdGFibGUgdGQge1xcbiAgcGFkZGluZzogMTBweDtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKTtcXG59XFxuXFxuLnNhdmUtbG9jYXRpb25zLXRhYmxlIHRoIHtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLWNvbG9yKTtcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxufVxcblxcbi5zYXZlLWxvY2F0aW9ucy10YWJsZSB0ZCBjb2RlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XFxuICBwYWRkaW5nOiAycHggNXB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbn1cXG5cXG4ubm90ZXMge1xcbiAgZm9udC1zaXplOiAwLjllbTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLWNvbG9yKTtcXG4gIG1hcmdpbjogNXB4IDA7XFxufVxcblxcbi53YXJuaW5nIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgY29sb3I6ICNmZmMxMDc7XFxuICBwYWRkaW5nOiAxMHB4O1xcbiAgYm9yZGVyOiAxcHggc29saWQgI2ZmYzEwNztcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAxOTMsIDcsIDAuMSk7XFxufVxcblxcbi8qIC0tLSBEcm9wIFpvbmUgJiBCdXR0b25zIC0tLSAqL1xcbi5kcm9wLXpvbmUge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiA0MHB4O1xcbiAgYm9yZGVyOiAycHggZGFzaGVkIHZhcigtLWJvcmRlci1jb2xvcik7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zdXJmYWNlLWNvbG9yKTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycywgYm9yZGVyLWNvbG9yIDAuMnM7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5kcm9wLXpvbmUuZHJhZ2dpbmcge1xcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yKTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XFxufVxcblxcbi5kcm9wLXpvbmUgcCB7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZC1jb2xvcik7XFxuICBtYXJnaW46IDAgMCAxNXB4IDA7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLmVycm9yLW1lc3NhZ2Uge1xcbiAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IpO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBtYXJnaW4tdG9wOiAxNXB4O1xcbn1cXG5cXG5idXR0b24ge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IFxcbiAgZm9udC1zaXplOiBpbmhlcml0OyBcXG4gIHBhZGRpbmc6IDEwcHggMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxufVxcblxcbi5idG4tc2Vjb25kYXJ5IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM0ZjRmNGY7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO1xcbn1cXG4uYnRuLXNlY29uZGFyeTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNWE1YTVhO1xcbn1cXG5cXG4uYnRuLXByaW1hcnkge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcbi5idG4tcHJpbWFyeTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWhvdmVyLWNvbG9yKTtcXG59XFxuXFxuYnV0dG9uOmRpc2FibGVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzZTNlM2U7XFxuICBjb2xvcjogIzc3NztcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcblxcbiNmaWxlLWlucHV0IHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5zYXZlLWJ1dHRvbnMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZ2FwOiAyMHB4O1xcbn1cXG5cXG5ociB7XFxuICBib3JkZXI6IG5vbmU7XFxuICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKTtcXG4gIG1hcmdpbjogMTBweCAwO1xcbn1cXG5cXG4vKiAtLS0gRWRpdG9yIEZvcm0gLS0tICovXFxuLmVkaXRvci1zZWN0aW9uIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXN1cmZhY2UtY29sb3IpO1xcbiAgcGFkZGluZzogMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvcik7XFxufVxcblxcbi5mb3JtLWdyaWQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDI1MHB4LCAxZnIpKTtcXG4gICAgZ2FwOiAyMHB4O1xcbn1cXG5cXG4uZm9ybS1ncm91cCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLmZvcm0tZ3JvdXAgbGFiZWwge1xcbiAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gIG1hcmdpbi1ib3R0b206IDhweDtcXG59XFxuXFxuLmZvcm0tZ3JvdXAgLm5vdGUge1xcbiAgZm9udC1zaXplOiAwLjhlbTtcXG4gIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLWNvbG9yKTtcXG4gIG1hcmdpbi10b3A6IDVweDtcXG59XFxuXFxuaW5wdXRbdHlwZT1cXFwibnVtYmVyXFxcIl0ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvcik7XFxuICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7XFxuICBwYWRkaW5nOiA4cHg7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMWVtO1xcbn1cXG5cXG4uY2hlY2tib3gtZ3JvdXAge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBnYXA6IDEwcHg7XFxufVxcblxcbmlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0ge1xcbiAgICB3aWR0aDogMS4zZW07XFxuICAgIGhlaWdodDogMS4zZW07XFxuICAgIGFjY2VudC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvcik7XFxufVxcblwiLCBcIlwiXSk7XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVzZVNvdXJjZU1hcCkge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIHJldHVybiAnQG1lZGlhICcgKyBpdGVtWzJdICsgJ3snICsgY29udGVudCArICd9JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgfVxuICAgIH0pLmpvaW4oJycpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCAnJ11dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZCA9IHRoaXNbaV1bMF07XG5cbiAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBtb2R1bGVzW2ldOyAvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG4gICAgICAvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuICAgICAgLy8gd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuICAgICAgLy8gSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXG4gICAgICBpZiAoaXRlbVswXSA9PSBudWxsIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGlmIChtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhUXVlcnk7XG4gICAgICAgIH0gZWxzZSBpZiAobWVkaWFRdWVyeSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSAnKCcgKyBpdGVtWzJdICsgJykgYW5kICgnICsgbWVkaWFRdWVyeSArICcpJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJztcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59IC8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcblxuXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcbiAgdmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcbiAgcmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn0iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuICB2YXIgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIHZhciBoYXMgPSByZXF1aXJlKCcuL2xpYi9oYXMnKTtcblxuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkgeyAvKiovIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAoaGFzKHR5cGVTcGVjcywgdHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpZiAodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoXG4gICAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogJyArIGxvY2F0aW9uICsgJyB0eXBlIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgJyArXG4gICAgICAgICAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSArICdgLicgK1xuICAgICAgICAgICAgICAnVGhpcyBvZnRlbiBoYXBwZW5zIGJlY2F1c2Ugb2YgdHlwb3Mgc3VjaCBhcyBgUHJvcFR5cGVzLmZ1bmN0aW9uYCBpbnN0ZWFkIG9mIGBQcm9wVHlwZXMuZnVuY2AuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yICYmICEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAnICtcbiAgICAgICAgICAgIGxvY2F0aW9uICsgJyBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJyArIHR5cGVvZiBlcnJvciArICcuICcgK1xuICAgICAgICAgICAgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArXG4gICAgICAgICAgICAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yICYmICEoZXJyb3IubWVzc2FnZSBpbiBsb2dnZWRUeXBlRmFpbHVyZXMpKSB7XG4gICAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgICAgLy8gc2FtZSBlcnJvci5cbiAgICAgICAgICBsb2dnZWRUeXBlRmFpbHVyZXNbZXJyb3IubWVzc2FnZV0gPSB0cnVlO1xuXG4gICAgICAgICAgdmFyIHN0YWNrID0gZ2V0U3RhY2sgPyBnZXRTdGFjaygpIDogJyc7XG5cbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAnRmFpbGVkICcgKyBsb2NhdGlvbiArICcgdHlwZTogJyArIGVycm9yLm1lc3NhZ2UgKyAoc3RhY2sgIT0gbnVsbCA/IHN0YWNrIDogJycpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlc2V0cyB3YXJuaW5nIGNhY2hlIHdoZW4gdGVzdGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jaGVja1Byb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tQcm9wVHlwZXM7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDtcbiIsIm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QtZG9tLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBNZXRhIFBsYXRmb3JtcywgSW5jLiBhbmQgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViAmJlxuICAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIG5vb3AoKSB7fVxuICAgIGZ1bmN0aW9uIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIFwiXCIgKyB2YWx1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlUG9ydGFsJDEoY2hpbGRyZW4sIGNvbnRhaW5lckluZm8sIGltcGxlbWVudGF0aW9uKSB7XG4gICAgICB2YXIga2V5ID1cbiAgICAgICAgMyA8IGFyZ3VtZW50cy5sZW5ndGggJiYgdm9pZCAwICE9PSBhcmd1bWVudHNbM10gPyBhcmd1bWVudHNbM10gOiBudWxsO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGVzdFN0cmluZ0NvZXJjaW9uKGtleSk7XG4gICAgICAgIHZhciBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgPSAhMTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gITA7XG4gICAgICB9XG4gICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgJiZcbiAgICAgICAgKGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJUaGUgcHJvdmlkZWQga2V5IGlzIGFuIHVuc3VwcG9ydGVkIHR5cGUgJXMuIFRoaXMgdmFsdWUgbXVzdCBiZSBjb2VyY2VkIHRvIGEgc3RyaW5nIGJlZm9yZSB1c2luZyBpdCBoZXJlLlwiLFxuICAgICAgICAgIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBTeW1ib2wgJiZcbiAgICAgICAgICAgIFN5bWJvbC50b1N0cmluZ1RhZyAmJlxuICAgICAgICAgICAga2V5W1N5bWJvbC50b1N0cmluZ1RhZ10pIHx8XG4gICAgICAgICAgICBrZXkuY29uc3RydWN0b3IubmFtZSB8fFxuICAgICAgICAgICAgXCJPYmplY3RcIlxuICAgICAgICApLFxuICAgICAgICB0ZXN0U3RyaW5nQ29lcmNpb24oa2V5KSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAkJHR5cGVvZjogUkVBQ1RfUE9SVEFMX1RZUEUsXG4gICAgICAgIGtleTogbnVsbCA9PSBrZXkgPyBudWxsIDogXCJcIiArIGtleSxcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgICBjb250YWluZXJJbmZvOiBjb250YWluZXJJbmZvLFxuICAgICAgICBpbXBsZW1lbnRhdGlvbjogaW1wbGVtZW50YXRpb25cbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENyb3NzT3JpZ2luU3RyaW5nQXMoYXMsIGlucHV0KSB7XG4gICAgICBpZiAoXCJmb250XCIgPT09IGFzKSByZXR1cm4gXCJcIjtcbiAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgaW5wdXQpXG4gICAgICAgIHJldHVybiBcInVzZS1jcmVkZW50aWFsc1wiID09PSBpbnB1dCA/IGlucHV0IDogXCJcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyh0aGluZykge1xuICAgICAgcmV0dXJuIG51bGwgPT09IHRoaW5nXG4gICAgICAgID8gXCJgbnVsbGBcIlxuICAgICAgICA6IHZvaWQgMCA9PT0gdGhpbmdcbiAgICAgICAgICA/IFwiYHVuZGVmaW5lZGBcIlxuICAgICAgICAgIDogXCJcIiA9PT0gdGhpbmdcbiAgICAgICAgICAgID8gXCJhbiBlbXB0eSBzdHJpbmdcIlxuICAgICAgICAgICAgOiAnc29tZXRoaW5nIHdpdGggdHlwZSBcIicgKyB0eXBlb2YgdGhpbmcgKyAnXCInO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyh0aGluZykge1xuICAgICAgcmV0dXJuIG51bGwgPT09IHRoaW5nXG4gICAgICAgID8gXCJgbnVsbGBcIlxuICAgICAgICA6IHZvaWQgMCA9PT0gdGhpbmdcbiAgICAgICAgICA/IFwiYHVuZGVmaW5lZGBcIlxuICAgICAgICAgIDogXCJcIiA9PT0gdGhpbmdcbiAgICAgICAgICAgID8gXCJhbiBlbXB0eSBzdHJpbmdcIlxuICAgICAgICAgICAgOiBcInN0cmluZ1wiID09PSB0eXBlb2YgdGhpbmdcbiAgICAgICAgICAgICAgPyBKU09OLnN0cmluZ2lmeSh0aGluZylcbiAgICAgICAgICAgICAgOiBcIm51bWJlclwiID09PSB0eXBlb2YgdGhpbmdcbiAgICAgICAgICAgICAgICA/IFwiYFwiICsgdGhpbmcgKyBcImBcIlxuICAgICAgICAgICAgICAgIDogJ3NvbWV0aGluZyB3aXRoIHR5cGUgXCInICsgdHlwZW9mIHRoaW5nICsgJ1wiJztcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVzb2x2ZURpc3BhdGNoZXIoKSB7XG4gICAgICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLkg7XG4gICAgICBudWxsID09PSBkaXNwYXRjaGVyICYmXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJJbnZhbGlkIGhvb2sgY2FsbC4gSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSBvZiB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4gVGhpcyBjb3VsZCBoYXBwZW4gZm9yIG9uZSBvZiB0aGUgZm9sbG93aW5nIHJlYXNvbnM6XFxuMS4gWW91IG1pZ2h0IGhhdmUgbWlzbWF0Y2hpbmcgdmVyc2lvbnMgb2YgUmVhY3QgYW5kIHRoZSByZW5kZXJlciAoc3VjaCBhcyBSZWFjdCBET00pXFxuMi4gWW91IG1pZ2h0IGJlIGJyZWFraW5nIHRoZSBSdWxlcyBvZiBIb29rc1xcbjMuIFlvdSBtaWdodCBoYXZlIG1vcmUgdGhhbiBvbmUgY29weSBvZiBSZWFjdCBpbiB0aGUgc2FtZSBhcHBcXG5TZWUgaHR0cHM6Ly9yZWFjdC5kZXYvbGluay9pbnZhbGlkLWhvb2stY2FsbCBmb3IgdGlwcyBhYm91dCBob3cgdG8gZGVidWcgYW5kIGZpeCB0aGlzIHByb2JsZW0uXCJcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiBkaXNwYXRjaGVyO1xuICAgIH1cbiAgICBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09XG4gICAgICAgIHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18ucmVnaXN0ZXJJbnRlcm5hbE1vZHVsZVN0YXJ0ICYmXG4gICAgICBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18ucmVnaXN0ZXJJbnRlcm5hbE1vZHVsZVN0YXJ0KEVycm9yKCkpO1xuICAgIHZhciBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKSxcbiAgICAgIEludGVybmFscyA9IHtcbiAgICAgICAgZDoge1xuICAgICAgICAgIGY6IG5vb3AsXG4gICAgICAgICAgcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgIFwiSW52YWxpZCBmb3JtIGVsZW1lbnQuIHJlcXVlc3RGb3JtUmVzZXQgbXVzdCBiZSBwYXNzZWQgYSBmb3JtIHRoYXQgd2FzIHJlbmRlcmVkIGJ5IFJlYWN0LlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgRDogbm9vcCxcbiAgICAgICAgICBDOiBub29wLFxuICAgICAgICAgIEw6IG5vb3AsXG4gICAgICAgICAgbTogbm9vcCxcbiAgICAgICAgICBYOiBub29wLFxuICAgICAgICAgIFM6IG5vb3AsXG4gICAgICAgICAgTTogbm9vcFxuICAgICAgICB9LFxuICAgICAgICBwOiAwLFxuICAgICAgICBmaW5kRE9NTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIFJFQUNUX1BPUlRBTF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSxcbiAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzID1cbiAgICAgICAgUmVhY3QuX19DTElFTlRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfV0FSTl9VU0VSU19USEVZX0NBTk5PVF9VUEdSQURFO1xuICAgIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBNYXAgJiZcbiAgICAgIG51bGwgIT0gTWFwLnByb3RvdHlwZSAmJlxuICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgTWFwLnByb3RvdHlwZS5mb3JFYWNoICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBTZXQgJiZcbiAgICAgIG51bGwgIT0gU2V0LnByb3RvdHlwZSAmJlxuICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgU2V0LnByb3RvdHlwZS5jbGVhciAmJlxuICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgU2V0LnByb3RvdHlwZS5mb3JFYWNoKSB8fFxuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgXCJSZWFjdCBkZXBlbmRzIG9uIE1hcCBhbmQgU2V0IGJ1aWx0LWluIHR5cGVzLiBNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhIHBvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL3JlYWN0anMub3JnL2xpbmsvcmVhY3QtcG9seWZpbGxzXCJcbiAgICAgICk7XG4gICAgZXhwb3J0cy5fX0RPTV9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9XQVJOX1VTRVJTX1RIRVlfQ0FOTk9UX1VQR1JBREUgPVxuICAgICAgSW50ZXJuYWxzO1xuICAgIGV4cG9ydHMuY3JlYXRlUG9ydGFsID0gZnVuY3Rpb24gKGNoaWxkcmVuLCBjb250YWluZXIpIHtcbiAgICAgIHZhciBrZXkgPVxuICAgICAgICAyIDwgYXJndW1lbnRzLmxlbmd0aCAmJiB2b2lkIDAgIT09IGFyZ3VtZW50c1syXSA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG4gICAgICBpZiAoXG4gICAgICAgICFjb250YWluZXIgfHxcbiAgICAgICAgKDEgIT09IGNvbnRhaW5lci5ub2RlVHlwZSAmJlxuICAgICAgICAgIDkgIT09IGNvbnRhaW5lci5ub2RlVHlwZSAmJlxuICAgICAgICAgIDExICE9PSBjb250YWluZXIubm9kZVR5cGUpXG4gICAgICApXG4gICAgICAgIHRocm93IEVycm9yKFwiVGFyZ2V0IGNvbnRhaW5lciBpcyBub3QgYSBET00gZWxlbWVudC5cIik7XG4gICAgICByZXR1cm4gY3JlYXRlUG9ydGFsJDEoY2hpbGRyZW4sIGNvbnRhaW5lciwgbnVsbCwga2V5KTtcbiAgICB9O1xuICAgIGV4cG9ydHMuZmx1c2hTeW5jID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICB2YXIgcHJldmlvdXNUcmFuc2l0aW9uID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCxcbiAgICAgICAgcHJldmlvdXNVcGRhdGVQcmlvcml0eSA9IEludGVybmFscy5wO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCgoUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCA9IG51bGwpLCAoSW50ZXJuYWxzLnAgPSAyKSwgZm4pKVxuICAgICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLlQgPSBwcmV2aW91c1RyYW5zaXRpb24pLFxuICAgICAgICAgIChJbnRlcm5hbHMucCA9IHByZXZpb3VzVXBkYXRlUHJpb3JpdHkpLFxuICAgICAgICAgIEludGVybmFscy5kLmYoKSAmJlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJmbHVzaFN5bmMgd2FzIGNhbGxlZCBmcm9tIGluc2lkZSBhIGxpZmVjeWNsZSBtZXRob2QuIFJlYWN0IGNhbm5vdCBmbHVzaCB3aGVuIFJlYWN0IGlzIGFscmVhZHkgcmVuZGVyaW5nLiBDb25zaWRlciBtb3ZpbmcgdGhpcyBjYWxsIHRvIGEgc2NoZWR1bGVyIHRhc2sgb3IgbWljcm8gdGFzay5cIlxuICAgICAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGV4cG9ydHMucHJlY29ubmVjdCA9IGZ1bmN0aW9uIChocmVmLCBvcHRpb25zKSB7XG4gICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJiBocmVmXG4gICAgICAgID8gbnVsbCAhPSBvcHRpb25zICYmIFwib2JqZWN0XCIgIT09IHR5cGVvZiBvcHRpb25zXG4gICAgICAgICAgPyBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlJlYWN0RE9NLnByZWNvbm5lY3QoKTogRXhwZWN0ZWQgdGhlIGBvcHRpb25zYCBhcmd1bWVudCAoc2Vjb25kKSB0byBiZSBhbiBvYmplY3QgYnV0IGVuY291bnRlcmVkICVzIGluc3RlYWQuIFRoZSBvbmx5IHN1cHBvcnRlZCBvcHRpb24gYXQgdGhpcyB0aW1lIGlzIGBjcm9zc09yaWdpbmAgd2hpY2ggYWNjZXB0cyBhIHN0cmluZy5cIixcbiAgICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nRW51bUZvcldhcm5pbmcob3B0aW9ucylcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IG51bGwgIT0gb3B0aW9ucyAmJlxuICAgICAgICAgICAgXCJzdHJpbmdcIiAhPT0gdHlwZW9mIG9wdGlvbnMuY3Jvc3NPcmlnaW4gJiZcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiUmVhY3RET00ucHJlY29ubmVjdCgpOiBFeHBlY3RlZCB0aGUgYGNyb3NzT3JpZ2luYCBvcHRpb24gKHNlY29uZCBhcmd1bWVudCkgdG8gYmUgYSBzdHJpbmcgYnV0IGVuY291bnRlcmVkICVzIGluc3RlYWQuIFRyeSByZW1vdmluZyB0aGlzIG9wdGlvbiBvciBwYXNzaW5nIGEgc3RyaW5nIHZhbHVlIGluc3RlYWQuXCIsXG4gICAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcob3B0aW9ucy5jcm9zc09yaWdpbilcbiAgICAgICAgICAgIClcbiAgICAgICAgOiBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgXCJSZWFjdERPTS5wcmVjb25uZWN0KCk6IEV4cGVjdGVkIHRoZSBgaHJlZmAgYXJndW1lbnQgKGZpcnN0KSB0byBiZSBhIG5vbi1lbXB0eSBzdHJpbmcgYnV0IGVuY291bnRlcmVkICVzIGluc3RlYWQuXCIsXG4gICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKGhyZWYpXG4gICAgICAgICAgKTtcbiAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmXG4gICAgICAgIChvcHRpb25zXG4gICAgICAgICAgPyAoKG9wdGlvbnMgPSBvcHRpb25zLmNyb3NzT3JpZ2luKSxcbiAgICAgICAgICAgIChvcHRpb25zID1cbiAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnNcbiAgICAgICAgICAgICAgICA/IFwidXNlLWNyZWRlbnRpYWxzXCIgPT09IG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgID8gb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgOiB2b2lkIDApKVxuICAgICAgICAgIDogKG9wdGlvbnMgPSBudWxsKSxcbiAgICAgICAgSW50ZXJuYWxzLmQuQyhocmVmLCBvcHRpb25zKSk7XG4gICAgfTtcbiAgICBleHBvcnRzLnByZWZldGNoRE5TID0gZnVuY3Rpb24gKGhyZWYpIHtcbiAgICAgIGlmIChcInN0cmluZ1wiICE9PSB0eXBlb2YgaHJlZiB8fCAhaHJlZilcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIlJlYWN0RE9NLnByZWZldGNoRE5TKCk6IEV4cGVjdGVkIHRoZSBgaHJlZmAgYXJndW1lbnQgKGZpcnN0KSB0byBiZSBhIG5vbi1lbXB0eSBzdHJpbmcgYnV0IGVuY291bnRlcmVkICVzIGluc3RlYWQuXCIsXG4gICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhocmVmKVxuICAgICAgICApO1xuICAgICAgZWxzZSBpZiAoMSA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiBvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJjcm9zc09yaWdpblwiKVxuICAgICAgICAgID8gY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJSZWFjdERPTS5wcmVmZXRjaEROUygpOiBFeHBlY3RlZCBvbmx5IG9uZSBhcmd1bWVudCwgYGhyZWZgLCBidXQgZW5jb3VudGVyZWQgJXMgYXMgYSBzZWNvbmQgYXJndW1lbnQgaW5zdGVhZC4gVGhpcyBhcmd1bWVudCBpcyByZXNlcnZlZCBmb3IgZnV0dXJlIG9wdGlvbnMgYW5kIGlzIGN1cnJlbnRseSBkaXNhbGxvd2VkLiBJdCBsb29rcyBsaWtlIHRoZSB5b3UgYXJlIGF0dGVtcHRpbmcgdG8gc2V0IGEgY3Jvc3NPcmlnaW4gcHJvcGVydHkgZm9yIHRoaXMgRE5TIGxvb2t1cCBoaW50LiBCcm93c2VycyBkbyBub3QgcGVyZm9ybSBETlMgcXVlcmllcyB1c2luZyBDT1JTIGFuZCBzZXR0aW5nIHRoaXMgYXR0cmlidXRlIG9uIHRoZSByZXNvdXJjZSBoaW50IGhhcyBubyBlZmZlY3QuIFRyeSBjYWxsaW5nIFJlYWN0RE9NLnByZWZldGNoRE5TKCkgd2l0aCBqdXN0IGEgc2luZ2xlIHN0cmluZyBhcmd1bWVudCwgYGhyZWZgLlwiLFxuICAgICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhvcHRpb25zKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJSZWFjdERPTS5wcmVmZXRjaEROUygpOiBFeHBlY3RlZCBvbmx5IG9uZSBhcmd1bWVudCwgYGhyZWZgLCBidXQgZW5jb3VudGVyZWQgJXMgYXMgYSBzZWNvbmQgYXJndW1lbnQgaW5zdGVhZC4gVGhpcyBhcmd1bWVudCBpcyByZXNlcnZlZCBmb3IgZnV0dXJlIG9wdGlvbnMgYW5kIGlzIGN1cnJlbnRseSBkaXNhbGxvd2VkLiBUcnkgY2FsbGluZyBSZWFjdERPTS5wcmVmZXRjaEROUygpIHdpdGgganVzdCBhIHNpbmdsZSBzdHJpbmcgYXJndW1lbnQsIGBocmVmYC5cIixcbiAgICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nRW51bUZvcldhcm5pbmcob3B0aW9ucylcbiAgICAgICAgICAgICk7XG4gICAgICB9XG4gICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJiBJbnRlcm5hbHMuZC5EKGhyZWYpO1xuICAgIH07XG4gICAgZXhwb3J0cy5wcmVpbml0ID0gZnVuY3Rpb24gKGhyZWYsIG9wdGlvbnMpIHtcbiAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmIGhyZWZcbiAgICAgICAgPyBudWxsID09IG9wdGlvbnMgfHwgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9wdGlvbnNcbiAgICAgICAgICA/IGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiUmVhY3RET00ucHJlaW5pdCgpOiBFeHBlY3RlZCB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IChzZWNvbmQpIHRvIGJlIGFuIG9iamVjdCB3aXRoIGFuIGBhc2AgcHJvcGVydHkgZGVzY3JpYmluZyB0aGUgdHlwZSBvZiByZXNvdXJjZSB0byBiZSBwcmVpbml0aWFsaXplZCBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC5cIixcbiAgICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nRW51bUZvcldhcm5pbmcob3B0aW9ucylcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IFwic3R5bGVcIiAhPT0gb3B0aW9ucy5hcyAmJlxuICAgICAgICAgICAgXCJzY3JpcHRcIiAhPT0gb3B0aW9ucy5hcyAmJlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgJ1JlYWN0RE9NLnByZWluaXQoKTogRXhwZWN0ZWQgdGhlIGBhc2AgcHJvcGVydHkgaW4gdGhlIGBvcHRpb25zYCBhcmd1bWVudCAoc2Vjb25kKSB0byBjb250YWluIGEgdmFsaWQgdmFsdWUgZGVzY3JpYmluZyB0aGUgdHlwZSBvZiByZXNvdXJjZSB0byBiZSBwcmVpbml0aWFsaXplZCBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC4gVmFsaWQgdmFsdWVzIGZvciBgYXNgIGFyZSBcInN0eWxlXCIgYW5kIFwic2NyaXB0XCIuJyxcbiAgICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nRW51bUZvcldhcm5pbmcob3B0aW9ucy5hcylcbiAgICAgICAgICAgIClcbiAgICAgICAgOiBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgXCJSZWFjdERPTS5wcmVpbml0KCk6IEV4cGVjdGVkIHRoZSBgaHJlZmAgYXJndW1lbnQgKGZpcnN0KSB0byBiZSBhIG5vbi1lbXB0eSBzdHJpbmcgYnV0IGVuY291bnRlcmVkICVzIGluc3RlYWQuXCIsXG4gICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKGhyZWYpXG4gICAgICAgICAgKTtcbiAgICAgIGlmIChcbiAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGhyZWYgJiZcbiAgICAgICAgb3B0aW9ucyAmJlxuICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5hc1xuICAgICAgKSB7XG4gICAgICAgIHZhciBhcyA9IG9wdGlvbnMuYXMsXG4gICAgICAgICAgY3Jvc3NPcmlnaW4gPSBnZXRDcm9zc09yaWdpblN0cmluZ0FzKGFzLCBvcHRpb25zLmNyb3NzT3JpZ2luKSxcbiAgICAgICAgICBpbnRlZ3JpdHkgPVxuICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuaW50ZWdyaXR5ID8gb3B0aW9ucy5pbnRlZ3JpdHkgOiB2b2lkIDAsXG4gICAgICAgICAgZmV0Y2hQcmlvcml0eSA9XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5mZXRjaFByaW9yaXR5XG4gICAgICAgICAgICAgID8gb3B0aW9ucy5mZXRjaFByaW9yaXR5XG4gICAgICAgICAgICAgIDogdm9pZCAwO1xuICAgICAgICBcInN0eWxlXCIgPT09IGFzXG4gICAgICAgICAgPyBJbnRlcm5hbHMuZC5TKFxuICAgICAgICAgICAgICBocmVmLFxuICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5wcmVjZWRlbmNlXG4gICAgICAgICAgICAgICAgPyBvcHRpb25zLnByZWNlZGVuY2VcbiAgICAgICAgICAgICAgICA6IHZvaWQgMCxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiBjcm9zc09yaWdpbixcbiAgICAgICAgICAgICAgICBpbnRlZ3JpdHk6IGludGVncml0eSxcbiAgICAgICAgICAgICAgICBmZXRjaFByaW9yaXR5OiBmZXRjaFByaW9yaXR5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IFwic2NyaXB0XCIgPT09IGFzICYmXG4gICAgICAgICAgICBJbnRlcm5hbHMuZC5YKGhyZWYsIHtcbiAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IGNyb3NzT3JpZ2luLFxuICAgICAgICAgICAgICBpbnRlZ3JpdHk6IGludGVncml0eSxcbiAgICAgICAgICAgICAgZmV0Y2hQcmlvcml0eTogZmV0Y2hQcmlvcml0eSxcbiAgICAgICAgICAgICAgbm9uY2U6IFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLm5vbmNlID8gb3B0aW9ucy5ub25jZSA6IHZvaWQgMFxuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBleHBvcnRzLnByZWluaXRNb2R1bGUgPSBmdW5jdGlvbiAoaHJlZiwgb3B0aW9ucykge1xuICAgICAgdmFyIGVuY291bnRlcmVkID0gXCJcIjtcbiAgICAgIChcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJiBocmVmKSB8fFxuICAgICAgICAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICBcIiBUaGUgYGhyZWZgIGFyZ3VtZW50IGVuY291bnRlcmVkIHdhcyBcIiArXG4gICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhocmVmKSArXG4gICAgICAgICAgXCIuXCIpO1xuICAgICAgdm9pZCAwICE9PSBvcHRpb25zICYmIFwib2JqZWN0XCIgIT09IHR5cGVvZiBvcHRpb25zXG4gICAgICAgID8gKGVuY291bnRlcmVkICs9XG4gICAgICAgICAgICBcIiBUaGUgYG9wdGlvbnNgIGFyZ3VtZW50IGVuY291bnRlcmVkIHdhcyBcIiArXG4gICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKG9wdGlvbnMpICtcbiAgICAgICAgICAgIFwiLlwiKVxuICAgICAgICA6IG9wdGlvbnMgJiZcbiAgICAgICAgICBcImFzXCIgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgIFwic2NyaXB0XCIgIT09IG9wdGlvbnMuYXMgJiZcbiAgICAgICAgICAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICAgIFwiIFRoZSBgYXNgIG9wdGlvbiBlbmNvdW50ZXJlZCB3YXMgXCIgK1xuICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nRW51bUZvcldhcm5pbmcob3B0aW9ucy5hcykgK1xuICAgICAgICAgICAgXCIuXCIpO1xuICAgICAgaWYgKGVuY291bnRlcmVkKVxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiUmVhY3RET00ucHJlaW5pdE1vZHVsZSgpOiBFeHBlY3RlZCB1cCB0byB0d28gYXJndW1lbnRzLCBhIG5vbi1lbXB0eSBgaHJlZmAgc3RyaW5nIGFuZCwgb3B0aW9uYWxseSwgYW4gYG9wdGlvbnNgIG9iamVjdCB3aXRoIGEgdmFsaWQgYGFzYCBwcm9wZXJ0eS4lc1wiLFxuICAgICAgICAgIGVuY291bnRlcmVkXG4gICAgICAgICk7XG4gICAgICBlbHNlXG4gICAgICAgIHN3aXRjaCAoXG4gICAgICAgICAgKChlbmNvdW50ZXJlZCA9XG4gICAgICAgICAgICBvcHRpb25zICYmIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmFzID8gb3B0aW9ucy5hcyA6IFwic2NyaXB0XCIpLFxuICAgICAgICAgIGVuY291bnRlcmVkKVxuICAgICAgICApIHtcbiAgICAgICAgICBjYXNlIFwic2NyaXB0XCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgKGVuY291bnRlcmVkID1cbiAgICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nRW51bUZvcldhcm5pbmcoZW5jb3VudGVyZWQpKSxcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAnUmVhY3RET00ucHJlaW5pdE1vZHVsZSgpOiBDdXJyZW50bHkgdGhlIG9ubHkgc3VwcG9ydGVkIFwiYXNcIiB0eXBlIGZvciB0aGlzIGZ1bmN0aW9uIGlzIFwic2NyaXB0XCIgYnV0IHJlY2VpdmVkIFwiJXNcIiBpbnN0ZWFkLiBUaGlzIHdhcm5pbmcgd2FzIGdlbmVyYXRlZCBmb3IgYGhyZWZgIFwiJXNcIi4gSW4gdGhlIGZ1dHVyZSBvdGhlciBtb2R1bGUgdHlwZXMgd2lsbCBiZSBzdXBwb3J0ZWQsIGFsaWduaW5nIHdpdGggdGhlIGltcG9ydC1hdHRyaWJ1dGVzIHByb3Bvc2FsLiBMZWFybiBtb3JlIGhlcmU6IChodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pbXBvcnQtYXR0cmlidXRlcyknLFxuICAgICAgICAgICAgICAgIGVuY291bnRlcmVkLFxuICAgICAgICAgICAgICAgIGhyZWZcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmKVxuICAgICAgICBpZiAoXCJvYmplY3RcIiA9PT0gdHlwZW9mIG9wdGlvbnMgJiYgbnVsbCAhPT0gb3B0aW9ucykge1xuICAgICAgICAgIGlmIChudWxsID09IG9wdGlvbnMuYXMgfHwgXCJzY3JpcHRcIiA9PT0gb3B0aW9ucy5hcylcbiAgICAgICAgICAgIChlbmNvdW50ZXJlZCA9IGdldENyb3NzT3JpZ2luU3RyaW5nQXMoXG4gICAgICAgICAgICAgIG9wdGlvbnMuYXMsXG4gICAgICAgICAgICAgIG9wdGlvbnMuY3Jvc3NPcmlnaW5cbiAgICAgICAgICAgICkpLFxuICAgICAgICAgICAgICBJbnRlcm5hbHMuZC5NKGhyZWYsIHtcbiAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogZW5jb3VudGVyZWQsXG4gICAgICAgICAgICAgICAgaW50ZWdyaXR5OlxuICAgICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuaW50ZWdyaXR5XG4gICAgICAgICAgICAgICAgICAgID8gb3B0aW9ucy5pbnRlZ3JpdHlcbiAgICAgICAgICAgICAgICAgICAgOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgbm9uY2U6XG4gICAgICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5ub25jZSA/IG9wdGlvbnMubm9uY2UgOiB2b2lkIDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBudWxsID09IG9wdGlvbnMgJiYgSW50ZXJuYWxzLmQuTShocmVmKTtcbiAgICB9O1xuICAgIGV4cG9ydHMucHJlbG9hZCA9IGZ1bmN0aW9uIChocmVmLCBvcHRpb25zKSB7XG4gICAgICB2YXIgZW5jb3VudGVyZWQgPSBcIlwiO1xuICAgICAgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmIGhyZWYpIHx8XG4gICAgICAgIChlbmNvdW50ZXJlZCArPVxuICAgICAgICAgIFwiIFRoZSBgaHJlZmAgYXJndW1lbnQgZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKGhyZWYpICtcbiAgICAgICAgICBcIi5cIik7XG4gICAgICBudWxsID09IG9wdGlvbnMgfHwgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9wdGlvbnNcbiAgICAgICAgPyAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICAgIFwiIFRoZSBgb3B0aW9uc2AgYXJndW1lbnQgZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcob3B0aW9ucykgK1xuICAgICAgICAgICAgXCIuXCIpXG4gICAgICAgIDogKFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmFzICYmIG9wdGlvbnMuYXMpIHx8XG4gICAgICAgICAgKGVuY291bnRlcmVkICs9XG4gICAgICAgICAgICBcIiBUaGUgYGFzYCBvcHRpb24gZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcob3B0aW9ucy5hcykgK1xuICAgICAgICAgICAgXCIuXCIpO1xuICAgICAgZW5jb3VudGVyZWQgJiZcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnUmVhY3RET00ucHJlbG9hZCgpOiBFeHBlY3RlZCB0d28gYXJndW1lbnRzLCBhIG5vbi1lbXB0eSBgaHJlZmAgc3RyaW5nIGFuZCBhbiBgb3B0aW9uc2Agb2JqZWN0IHdpdGggYW4gYGFzYCBwcm9wZXJ0eSB2YWxpZCBmb3IgYSBgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGFzPVwiLi4uXCIgLz5gIHRhZy4lcycsXG4gICAgICAgICAgZW5jb3VudGVyZWRcbiAgICAgICAgKTtcbiAgICAgIGlmIChcbiAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGhyZWYgJiZcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIG9wdGlvbnMgJiZcbiAgICAgICAgbnVsbCAhPT0gb3B0aW9ucyAmJlxuICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5hc1xuICAgICAgKSB7XG4gICAgICAgIGVuY291bnRlcmVkID0gb3B0aW9ucy5hcztcbiAgICAgICAgdmFyIGNyb3NzT3JpZ2luID0gZ2V0Q3Jvc3NPcmlnaW5TdHJpbmdBcyhcbiAgICAgICAgICBlbmNvdW50ZXJlZCxcbiAgICAgICAgICBvcHRpb25zLmNyb3NzT3JpZ2luXG4gICAgICAgICk7XG4gICAgICAgIEludGVybmFscy5kLkwoaHJlZiwgZW5jb3VudGVyZWQsIHtcbiAgICAgICAgICBjcm9zc09yaWdpbjogY3Jvc3NPcmlnaW4sXG4gICAgICAgICAgaW50ZWdyaXR5OlxuICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuaW50ZWdyaXR5ID8gb3B0aW9ucy5pbnRlZ3JpdHkgOiB2b2lkIDAsXG4gICAgICAgICAgbm9uY2U6IFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLm5vbmNlID8gb3B0aW9ucy5ub25jZSA6IHZvaWQgMCxcbiAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy50eXBlID8gb3B0aW9ucy50eXBlIDogdm9pZCAwLFxuICAgICAgICAgIGZldGNoUHJpb3JpdHk6XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5mZXRjaFByaW9yaXR5XG4gICAgICAgICAgICAgID8gb3B0aW9ucy5mZXRjaFByaW9yaXR5XG4gICAgICAgICAgICAgIDogdm9pZCAwLFxuICAgICAgICAgIHJlZmVycmVyUG9saWN5OlxuICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMucmVmZXJyZXJQb2xpY3lcbiAgICAgICAgICAgICAgPyBvcHRpb25zLnJlZmVycmVyUG9saWN5XG4gICAgICAgICAgICAgIDogdm9pZCAwLFxuICAgICAgICAgIGltYWdlU3JjU2V0OlxuICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuaW1hZ2VTcmNTZXRcbiAgICAgICAgICAgICAgPyBvcHRpb25zLmltYWdlU3JjU2V0XG4gICAgICAgICAgICAgIDogdm9pZCAwLFxuICAgICAgICAgIGltYWdlU2l6ZXM6XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5pbWFnZVNpemVzXG4gICAgICAgICAgICAgID8gb3B0aW9ucy5pbWFnZVNpemVzXG4gICAgICAgICAgICAgIDogdm9pZCAwLFxuICAgICAgICAgIG1lZGlhOiBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5tZWRpYSA/IG9wdGlvbnMubWVkaWEgOiB2b2lkIDBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBleHBvcnRzLnByZWxvYWRNb2R1bGUgPSBmdW5jdGlvbiAoaHJlZiwgb3B0aW9ucykge1xuICAgICAgdmFyIGVuY291bnRlcmVkID0gXCJcIjtcbiAgICAgIChcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJiBocmVmKSB8fFxuICAgICAgICAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICBcIiBUaGUgYGhyZWZgIGFyZ3VtZW50IGVuY291bnRlcmVkIHdhcyBcIiArXG4gICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhocmVmKSArXG4gICAgICAgICAgXCIuXCIpO1xuICAgICAgdm9pZCAwICE9PSBvcHRpb25zICYmIFwib2JqZWN0XCIgIT09IHR5cGVvZiBvcHRpb25zXG4gICAgICAgID8gKGVuY291bnRlcmVkICs9XG4gICAgICAgICAgICBcIiBUaGUgYG9wdGlvbnNgIGFyZ3VtZW50IGVuY291bnRlcmVkIHdhcyBcIiArXG4gICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKG9wdGlvbnMpICtcbiAgICAgICAgICAgIFwiLlwiKVxuICAgICAgICA6IG9wdGlvbnMgJiZcbiAgICAgICAgICBcImFzXCIgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgIFwic3RyaW5nXCIgIT09IHR5cGVvZiBvcHRpb25zLmFzICYmXG4gICAgICAgICAgKGVuY291bnRlcmVkICs9XG4gICAgICAgICAgICBcIiBUaGUgYGFzYCBvcHRpb24gZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcob3B0aW9ucy5hcykgK1xuICAgICAgICAgICAgXCIuXCIpO1xuICAgICAgZW5jb3VudGVyZWQgJiZcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnUmVhY3RET00ucHJlbG9hZE1vZHVsZSgpOiBFeHBlY3RlZCB0d28gYXJndW1lbnRzLCBhIG5vbi1lbXB0eSBgaHJlZmAgc3RyaW5nIGFuZCwgb3B0aW9uYWxseSwgYW4gYG9wdGlvbnNgIG9iamVjdCB3aXRoIGFuIGBhc2AgcHJvcGVydHkgdmFsaWQgZm9yIGEgYDxsaW5rIHJlbD1cIm1vZHVsZXByZWxvYWRcIiBhcz1cIi4uLlwiIC8+YCB0YWcuJXMnLFxuICAgICAgICAgIGVuY291bnRlcmVkXG4gICAgICAgICk7XG4gICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJlxuICAgICAgICAob3B0aW9uc1xuICAgICAgICAgID8gKChlbmNvdW50ZXJlZCA9IGdldENyb3NzT3JpZ2luU3RyaW5nQXMoXG4gICAgICAgICAgICAgIG9wdGlvbnMuYXMsXG4gICAgICAgICAgICAgIG9wdGlvbnMuY3Jvc3NPcmlnaW5cbiAgICAgICAgICAgICkpLFxuICAgICAgICAgICAgSW50ZXJuYWxzLmQubShocmVmLCB7XG4gICAgICAgICAgICAgIGFzOlxuICAgICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmFzICYmIFwic2NyaXB0XCIgIT09IG9wdGlvbnMuYXNcbiAgICAgICAgICAgICAgICAgID8gb3B0aW9ucy5hc1xuICAgICAgICAgICAgICAgICAgOiB2b2lkIDAsXG4gICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiBlbmNvdW50ZXJlZCxcbiAgICAgICAgICAgICAgaW50ZWdyaXR5OlxuICAgICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmludGVncml0eVxuICAgICAgICAgICAgICAgICAgPyBvcHRpb25zLmludGVncml0eVxuICAgICAgICAgICAgICAgICAgOiB2b2lkIDBcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIDogSW50ZXJuYWxzLmQubShocmVmKSk7XG4gICAgfTtcbiAgICBleHBvcnRzLnJlcXVlc3RGb3JtUmVzZXQgPSBmdW5jdGlvbiAoZm9ybSkge1xuICAgICAgSW50ZXJuYWxzLmQucihmb3JtKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMgPSBmdW5jdGlvbiAoZm4sIGEpIHtcbiAgICAgIHJldHVybiBmbihhKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlRm9ybVN0YXRlID0gZnVuY3Rpb24gKGFjdGlvbiwgaW5pdGlhbFN0YXRlLCBwZXJtYWxpbmspIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUZvcm1TdGF0ZShhY3Rpb24sIGluaXRpYWxTdGF0ZSwgcGVybWFsaW5rKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlRm9ybVN0YXR1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUhvc3RUcmFuc2l0aW9uU3RhdHVzKCk7XG4gICAgfTtcbiAgICBleHBvcnRzLnZlcnNpb24gPSBcIjE5LjEuMVwiO1xuICAgIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gJiZcbiAgICAgIFwiZnVuY3Rpb25cIiA9PT1cbiAgICAgICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RvcCAmJlxuICAgICAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdG9wKEVycm9yKCkpO1xuICB9KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBjaGVja0RDRSgpIHtcbiAgLyogZ2xvYmFsIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAqL1xuICBpZiAoXG4gICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLmNoZWNrRENFICE9PSAnZnVuY3Rpb24nXG4gICkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIFRoaXMgYnJhbmNoIGlzIHVucmVhY2hhYmxlIGJlY2F1c2UgdGhpcyBmdW5jdGlvbiBpcyBvbmx5IGNhbGxlZFxuICAgIC8vIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgY29uZGl0aW9uIGlzIHRydWUgb25seSBpbiBkZXZlbG9wbWVudC5cbiAgICAvLyBUaGVyZWZvcmUgaWYgdGhlIGJyYW5jaCBpcyBzdGlsbCBoZXJlLCBkZWFkIGNvZGUgZWxpbWluYXRpb24gd2Fzbid0XG4gICAgLy8gcHJvcGVybHkgYXBwbGllZC5cbiAgICAvLyBEb24ndCBjaGFuZ2UgdGhlIG1lc3NhZ2UuIFJlYWN0IERldlRvb2xzIHJlbGllcyBvbiBpdC4gQWxzbyBtYWtlIHN1cmVcbiAgICAvLyB0aGlzIG1lc3NhZ2UgZG9lc24ndCBvY2N1ciBlbHNld2hlcmUgaW4gdGhpcyBmdW5jdGlvbiwgb3IgaXQgd2lsbCBjYXVzZVxuICAgIC8vIGEgZmFsc2UgcG9zaXRpdmUuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdeX14nKTtcbiAgfVxuICB0cnkge1xuICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBjb2RlIGFib3ZlIGhhcyBiZWVuIGRlYWQgY29kZSBlbGltaW5hdGVkIChEQ0UnZCkuXG4gICAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLmNoZWNrRENFKGNoZWNrRENFKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgLy8gRGV2VG9vbHMgc2hvdWxkbid0IGNyYXNoIFJlYWN0LCBubyBtYXR0ZXIgd2hhdC5cbiAgICAvLyBXZSBzaG91bGQgc3RpbGwgcmVwb3J0IGluIGNhc2Ugd2UgYnJlYWsgdGhpcyBjb2RlLlxuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICAvLyBEQ0UgY2hlY2sgc2hvdWxkIGhhcHBlbiBiZWZvcmUgUmVhY3RET00gYnVuZGxlIGV4ZWN1dGVzIHNvIHRoYXRcbiAgLy8gRGV2VG9vbHMgY2FuIHJlcG9ydCBiYWQgbWluaWZpY2F0aW9uIGR1cmluZyBpbmplY3Rpb24uXG4gIGNoZWNrRENFKCk7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtZG9tLnByb2R1Y3Rpb24uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtZG9tLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjE0LjBcbiAqIHJlYWN0LmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcycpO1xuXG52YXIgUmVhY3RWZXJzaW9uID0gJzE2LjE0LjAnO1xuXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIGhhc1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG52YXIgUkVBQ1RfUE9SVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wb3J0YWwnKSA6IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZnJhZ21lbnQnKSA6IDB4ZWFjYjtcbnZhciBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3RyaWN0X21vZGUnKSA6IDB4ZWFjYztcbnZhciBSRUFDVF9QUk9GSUxFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvZmlsZXInKSA6IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucHJvdmlkZXInKSA6IDB4ZWFjZDtcbnZhciBSRUFDVF9DT05URVhUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb250ZXh0JykgOiAweGVhY2U7IC8vIFRPRE86IFdlIGRvbid0IHVzZSBBc3luY01vZGUgb3IgQ29uY3VycmVudE1vZGUgYW55bW9yZS4gVGhleSB3ZXJlIHRlbXBvcmFyeVxudmFyIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29uY3VycmVudF9tb2RlJykgOiAweGVhY2Y7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZvcndhcmRfcmVmJykgOiAweGVhZDA7XG52YXIgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlJykgOiAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2VfbGlzdCcpIDogMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmJsb2NrJykgOiAweGVhZDk7XG52YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZ1bmRhbWVudGFsJykgOiAweGVhZDU7XG52YXIgUkVBQ1RfUkVTUE9OREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5yZXNwb25kZXInKSA6IDB4ZWFkNjtcbnZhciBSRUFDVF9TQ09QRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc2NvcGUnKSA6IDB4ZWFkNztcbnZhciBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICBpZiAobWF5YmVJdGVyYWJsZSA9PT0gbnVsbCB8fCB0eXBlb2YgbWF5YmVJdGVyYWJsZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBtYXliZUl0ZXJhdG9yID0gTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXTtcblxuICBpZiAodHlwZW9mIG1heWJlSXRlcmF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF5YmVJdGVyYXRvcjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGRpc3BhdGNoZXIuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnREaXNwYXRjaGVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgYmF0Y2gncyBjb25maWd1cmF0aW9uIHN1Y2ggYXMgaG93IGxvbmcgYW4gdXBkYXRlXG4gKiBzaG91bGQgc3VzcGVuZCBmb3IgaWYgaXQgbmVlZHMgdG8uXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyA9IHtcbiAgc3VzcGVuc2U6IG51bGxcbn07XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgb3duZXIuXG4gKlxuICogVGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIGNvbXBvbmVudCB3aG8gc2hvdWxkIG93biBhbnkgY29tcG9uZW50cyB0aGF0IGFyZVxuICogY3VycmVudGx5IGJlaW5nIGNvbnN0cnVjdGVkLlxuICovXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxudmFyIEJFRk9SRV9TTEFTSF9SRSA9IC9eKC4qKVtcXFxcXFwvXS87XG5mdW5jdGlvbiBkZXNjcmliZUNvbXBvbmVudEZyYW1lIChuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICB2YXIgc291cmNlSW5mbyA9ICcnO1xuXG4gIGlmIChzb3VyY2UpIHtcbiAgICB2YXIgcGF0aCA9IHNvdXJjZS5maWxlTmFtZTtcbiAgICB2YXIgZmlsZU5hbWUgPSBwYXRoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG5cbiAgICB7XG4gICAgICAvLyBJbiBERVYsIGluY2x1ZGUgY29kZSBmb3IgYSBjb21tb24gc3BlY2lhbCBjYXNlOlxuICAgICAgLy8gcHJlZmVyIFwiZm9sZGVyL2luZGV4LmpzXCIgaW5zdGVhZCBvZiBqdXN0IFwiaW5kZXguanNcIi5cbiAgICAgIGlmICgvXmluZGV4XFwuLy50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBwYXRoLm1hdGNoKEJFRk9SRV9TTEFTSF9SRSk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgdmFyIHBhdGhCZWZvcmVTbGFzaCA9IG1hdGNoWzFdO1xuXG4gICAgICAgICAgaWYgKHBhdGhCZWZvcmVTbGFzaCkge1xuICAgICAgICAgICAgdmFyIGZvbGRlck5hbWUgPSBwYXRoQmVmb3JlU2xhc2gucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZm9sZGVyTmFtZSArICcvJyArIGZpbGVOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNvdXJjZUluZm8gPSAnIChhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBzb3VyY2UubGluZU51bWJlciArICcpJztcbiAgfSBlbHNlIGlmIChvd25lck5hbWUpIHtcbiAgICBzb3VyY2VJbmZvID0gJyAoY3JlYXRlZCBieSAnICsgb3duZXJOYW1lICsgJyknO1xuICB9XG5cbiAgcmV0dXJuICdcXG4gICAgaW4gJyArIChuYW1lIHx8ICdVbmtub3duJykgKyBzb3VyY2VJbmZvO1xufVxuXG52YXIgUmVzb2x2ZWQgPSAxO1xuZnVuY3Rpb24gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KGxhenlDb21wb25lbnQpIHtcbiAgcmV0dXJuIGxhenlDb21wb25lbnQuX3N0YXR1cyA9PT0gUmVzb2x2ZWQgPyBsYXp5Q29tcG9uZW50Ll9yZXN1bHQgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRXcmFwcGVkTmFtZShvdXRlclR5cGUsIGlubmVyVHlwZSwgd3JhcHBlck5hbWUpIHtcbiAgdmFyIGZ1bmN0aW9uTmFtZSA9IGlubmVyVHlwZS5kaXNwbGF5TmFtZSB8fCBpbm5lclR5cGUubmFtZSB8fCAnJztcbiAgcmV0dXJuIG91dGVyVHlwZS5kaXNwbGF5TmFtZSB8fCAoZnVuY3Rpb25OYW1lICE9PSAnJyA/IHdyYXBwZXJOYW1lICsgXCIoXCIgKyBmdW5jdGlvbk5hbWUgKyBcIilcIiA6IHdyYXBwZXJOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKSB7XG4gIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAvLyBIb3N0IHJvb3QsIHRleHQgbm9kZSBvciBqdXN0IGludmFsaWQgdHlwZS5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHtcbiAgICBpZiAodHlwZW9mIHR5cGUudGFnID09PSAnbnVtYmVyJykge1xuICAgICAgZXJyb3IoJ1JlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWUoKS4gJyArICdUaGlzIGlzIGxpa2VseSBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8IG51bGw7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICByZXR1cm4gJ0ZyYWdtZW50JztcblxuICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICByZXR1cm4gJ1BvcnRhbCc7XG5cbiAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICByZXR1cm4gXCJQcm9maWxlclwiO1xuXG4gICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgcmV0dXJuICdTdHJpY3RNb2RlJztcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2UnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlTGlzdCc7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgc3dpdGNoICh0eXBlLiQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0LkNvbnN1bWVyJztcblxuICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuUHJvdmlkZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRXcmFwcGVkTmFtZSh0eXBlLCB0eXBlLnJlbmRlciwgJ0ZvcndhcmRSZWYnKTtcblxuICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSk7XG5cbiAgICAgIGNhc2UgUkVBQ1RfQkxPQ0tfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS5yZW5kZXIpO1xuXG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciB0aGVuYWJsZSA9IHR5cGU7XG4gICAgICAgICAgdmFyIHJlc29sdmVkVGhlbmFibGUgPSByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQodGhlbmFibGUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmVkVGhlbmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHJlc29sdmVkVGhlbmFibGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0ge307XG52YXIgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBudWxsO1xuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCkge1xuICB7XG4gICAgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQgPSBlbGVtZW50O1xuICB9XG59XG5cbntcbiAgLy8gU3RhY2sgaW1wbGVtZW50YXRpb24gaW5qZWN0ZWQgYnkgdGhlIGN1cnJlbnQgcmVuZGVyZXIuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrID0gbnVsbDtcblxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YWNrID0gJyc7IC8vIEFkZCBhbiBleHRyYSB0b3AgZnJhbWUgd2hpbGUgYW4gZWxlbWVudCBpcyBiZWluZyB2YWxpZGF0ZWRcblxuICAgIGlmIChjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCkge1xuICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50LnR5cGUpO1xuICAgICAgdmFyIG93bmVyID0gY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX293bmVyO1xuICAgICAgc3RhY2sgKz0gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lLCBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fc291cmNlLCBvd25lciAmJiBnZXRDb21wb25lbnROYW1lKG93bmVyLnR5cGUpKTtcbiAgICB9IC8vIERlbGVnYXRlIHRvIHRoZSBpbmplY3RlZCByZW5kZXJlci1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvblxuXG5cbiAgICB2YXIgaW1wbCA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0Q3VycmVudFN0YWNrO1xuXG4gICAgaWYgKGltcGwpIHtcbiAgICAgIHN0YWNrICs9IGltcGwoKSB8fCAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhY2s7XG4gIH07XG59XG5cbi8qKlxuICogVXNlZCBieSBhY3QoKSB0byB0cmFjayB3aGV0aGVyIHlvdSdyZSBpbnNpZGUgYW4gYWN0KCkgc2NvcGUuXG4gKi9cbnZhciBJc1NvbWVSZW5kZXJlckFjdGluZyA9IHtcbiAgY3VycmVudDogZmFsc2Vcbn07XG5cbnZhciBSZWFjdFNoYXJlZEludGVybmFscyA9IHtcbiAgUmVhY3RDdXJyZW50RGlzcGF0Y2hlcjogUmVhY3RDdXJyZW50RGlzcGF0Y2hlcixcbiAgUmVhY3RDdXJyZW50QmF0Y2hDb25maWc6IFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnLFxuICBSZWFjdEN1cnJlbnRPd25lcjogUmVhY3RDdXJyZW50T3duZXIsXG4gIElzU29tZVJlbmRlcmVyQWN0aW5nOiBJc1NvbWVSZW5kZXJlckFjdGluZyxcbiAgLy8gVXNlZCBieSByZW5kZXJlcnMgdG8gYXZvaWQgYnVuZGxpbmcgb2JqZWN0LWFzc2lnbiB0d2ljZSBpbiBVTUQgYnVuZGxlczpcbiAgYXNzaWduOiBfYXNzaWduXG59O1xuXG57XG4gIF9hc3NpZ24oUmVhY3RTaGFyZWRJbnRlcm5hbHMsIHtcbiAgICAvLyBUaGVzZSBzaG91bGQgbm90IGJlIGluY2x1ZGVkIGluIHByb2R1Y3Rpb24uXG4gICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTogUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSxcbiAgICAvLyBTaGltIGZvciBSZWFjdCBET00gMTYuMC4wIHdoaWNoIHN0aWxsIGRlc3RydWN0dXJlZCAoYnV0IG5vdCB1c2VkKSB0aGlzLlxuICAgIC8vIFRPRE86IHJlbW92ZSBpbiBSZWFjdCAxNy4wLlxuICAgIFJlYWN0Q29tcG9uZW50VHJlZUhvb2s6IHt9XG4gIH0pO1xufVxuXG4vLyBieSBjYWxscyB0byB0aGVzZSBtZXRob2RzIGJ5IGEgQmFiZWwgcGx1Z2luLlxuLy9cbi8vIEluIFBST0QgKG9yIGluIHBhY2thZ2VzIHdpdGhvdXQgYWNjZXNzIHRvIFJlYWN0IGludGVybmFscyksXG4vLyB0aGV5IGFyZSBsZWZ0IGFzIHRoZXkgYXJlIGluc3RlYWQuXG5cbmZ1bmN0aW9uIHdhcm4oZm9ybWF0KSB7XG4gIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBwcmludFdhcm5pbmcoJ3dhcm4nLCBmb3JtYXQsIGFyZ3MpO1xuICB9XG59XG5mdW5jdGlvbiBlcnJvcihmb3JtYXQpIHtcbiAge1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHByaW50V2FybmluZygnZXJyb3InLCBmb3JtYXQsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByaW50V2FybmluZyhsZXZlbCwgZm9ybWF0LCBhcmdzKSB7XG4gIC8vIFdoZW4gY2hhbmdpbmcgdGhpcyBsb2dpYywgeW91IG1pZ2h0IHdhbnQgdG8gYWxzb1xuICAvLyB1cGRhdGUgY29uc29sZVdpdGhTdGFja0Rldi53d3cuanMgYXMgd2VsbC5cbiAge1xuICAgIHZhciBoYXNFeGlzdGluZ1N0YWNrID0gYXJncy5sZW5ndGggPiAwICYmIHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09ICdzdHJpbmcnICYmIGFyZ3NbYXJncy5sZW5ndGggLSAxXS5pbmRleE9mKCdcXG4gICAgaW4nKSA9PT0gMDtcblxuICAgIGlmICghaGFzRXhpc3RpbmdTdGFjaykge1xuICAgICAgdmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5SZWFjdERlYnVnQ3VycmVudEZyYW1lO1xuICAgICAgdmFyIHN0YWNrID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG5cbiAgICAgIGlmIChzdGFjayAhPT0gJycpIHtcbiAgICAgICAgZm9ybWF0ICs9ICclcyc7XG4gICAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbc3RhY2tdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXJnc1dpdGhGb3JtYXQgPSBhcmdzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuICcnICsgaXRlbTtcbiAgICB9KTsgLy8gQ2FyZWZ1bDogUk4gY3VycmVudGx5IGRlcGVuZHMgb24gdGhpcyBwcmVmaXhcblxuICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpOyAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgIC8vIGJyZWFrcyBJRTk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTM2MTBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nXG5cbiAgICBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlW2xldmVsXSwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfVxufVxuXG52YXIgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50ID0ge307XG5cbmZ1bmN0aW9uIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBjYWxsZXJOYW1lKSB7XG4gIHtcbiAgICB2YXIgX2NvbnN0cnVjdG9yID0gcHVibGljSW5zdGFuY2UuY29uc3RydWN0b3I7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBfY29uc3RydWN0b3IgJiYgKF9jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBfY29uc3RydWN0b3IubmFtZSkgfHwgJ1JlYWN0Q2xhc3MnO1xuICAgIHZhciB3YXJuaW5nS2V5ID0gY29tcG9uZW50TmFtZSArIFwiLlwiICsgY2FsbGVyTmFtZTtcblxuICAgIGlmIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlcnJvcihcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFwiICsgJ1RoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uICcgKyAnSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgICcgKyAnY2xhc3MgcHJvcGVydHkgd2l0aCB0aGUgZGVzaXJlZCBzdGF0ZSBpbiB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNvbXBvbmVudE5hbWUpO1xuXG4gICAgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldID0gdHJ1ZTtcbiAgfVxufVxuLyoqXG4gKiBUaGlzIGlzIHRoZSBhYnN0cmFjdCBBUEkgZm9yIGFuIHVwZGF0ZSBxdWV1ZS5cbiAqL1xuXG5cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGlzIGNvbXBvc2l0ZSBjb21wb25lbnQgaXMgbW91bnRlZC5cbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2Ugd2Ugd2FudCB0byB0ZXN0LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gICAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gICAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gICAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjb21wbGV0ZVN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAncmVwbGFjZVN0YXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBUaGlzIG9ubHkgZXhpc3RzIGJlY2F1c2UgX3BlbmRpbmdTdGF0ZSBpc1xuICAgKiBpbnRlcm5hbC4gVGhpcyBwcm92aWRlcyBhIG1lcmdpbmcgc3RyYXRlZ3kgdGhhdCBpcyBub3QgYXZhaWxhYmxlIHRvIGRlZXBcbiAgICogcHJvcGVydGllcyB3aGljaCBpcyBjb25mdXNpbmcuIFRPRE86IEV4cG9zZSBwZW5kaW5nU3RhdGUgb3IgZG9uJ3QgdXNlIGl0XG4gICAqIGR1cmluZyB0aGUgbWVyZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBzdGF0ZS5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBOYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVTZXRTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcblxue1xuICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbn1cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cblxuXG5mdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0OyAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cblxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDsgLy8gV2UgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCB1cGRhdGVyIGJ1dCB0aGUgcmVhbCBvbmUgZ2V0cyBpbmplY3RlZCBieSB0aGVcbiAgLy8gcmVuZGVyZXIuXG5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuXG5Db21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgaWYgKCEodHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhcnRpYWxTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyB8fCBwYXJ0aWFsU3RhdGUgPT0gbnVsbCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlU2V0U3RhdGUodGhpcywgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgJ3NldFN0YXRlJyk7XG59O1xuLyoqXG4gKiBGb3JjZXMgYW4gdXBkYXRlLiBUaGlzIHNob3VsZCBvbmx5IGJlIGludm9rZWQgd2hlbiBpdCBpcyBrbm93biB3aXRoXG4gKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4geW91IGtub3cgdGhhdCBzb21lIGRlZXBlciBhc3BlY3Qgb2YgdGhlXG4gKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAqXG4gKiBUaGlzIHdpbGwgbm90IGludm9rZSBgc2hvdWxkQ29tcG9uZW50VXBkYXRlYCwgYnV0IGl0IHdpbGwgaW52b2tlXG4gKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICpcbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cblxuXG5Db21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcywgY2FsbGJhY2ssICdmb3JjZVVwZGF0ZScpO1xufTtcbi8qKlxuICogRGVwcmVjYXRlZCBBUElzLiBUaGVzZSBBUElzIHVzZWQgdG8gZXhpc3Qgb24gY2xhc3NpYyBSZWFjdCBjbGFzc2VzIGJ1dCBzaW5jZVxuICogd2Ugd291bGQgbGlrZSB0byBkZXByZWNhdGUgdGhlbSwgd2UncmUgbm90IGdvaW5nIHRvIG1vdmUgdGhlbSBvdmVyIHRvIHRoaXNcbiAqIG1vZGVybiBiYXNlIGNsYXNzLiBJbnN0ZWFkLCB3ZSBkZWZpbmUgYSBnZXR0ZXIgdGhhdCB3YXJucyBpZiBpdCdzIGFjY2Vzc2VkLlxuICovXG5cblxue1xuICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgaXNNb3VudGVkOiBbJ2lzTW91bnRlZCcsICdJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiAnICsgJ2NvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLiddLFxuICAgIHJlcGxhY2VTdGF0ZTogWydyZXBsYWNlU3RhdGUnLCAnUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgJyArICdodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzMyMzYpLiddXG4gIH07XG5cbiAgdmFyIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBpbmZvKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB3YXJuKCclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pO1xuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgZm9yICh2YXIgZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRBUElzLmhhc093blByb3BlcnR5KGZuTmFtZSkpIHtcbiAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBDb21wb25lbnREdW1teSgpIHt9XG5cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG4vKipcbiAqIENvbnZlbmllbmNlIGNvbXBvbmVudCB3aXRoIGRlZmF1bHQgc2hhbGxvdyBlcXVhbGl0eSBjaGVjayBmb3Igc0NVLlxuICovXG5cbmZ1bmN0aW9uIFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0OyAvLyBJZiBhIGNvbXBvbmVudCBoYXMgc3RyaW5nIHJlZnMsIHdlIHdpbGwgYXNzaWduIGEgZGlmZmVyZW50IG9iamVjdCBsYXRlci5cblxuICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxudmFyIHB1cmVDb21wb25lbnRQcm90b3R5cGUgPSBQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFB1cmVDb21wb25lbnQ7IC8vIEF2b2lkIGFuIGV4dHJhIHByb3RvdHlwZSBqdW1wIGZvciB0aGVzZSBtZXRob2RzLlxuXG5fYXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xuXG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gdHJ1ZTtcblxuLy8gYW4gaW1tdXRhYmxlIG9iamVjdCB3aXRoIGEgc2luZ2xlIG11dGFibGUgdmFsdWVcbmZ1bmN0aW9uIGNyZWF0ZVJlZigpIHtcbiAgdmFyIHJlZk9iamVjdCA9IHtcbiAgICBjdXJyZW50OiBudWxsXG4gIH07XG5cbiAge1xuICAgIE9iamVjdC5zZWFsKHJlZk9iamVjdCk7XG4gIH1cblxuICByZXR1cm4gcmVmT2JqZWN0O1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biwgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24sIGRpZFdhcm5BYm91dFN0cmluZ1JlZnM7XG5cbntcbiAgZGlkV2FybkFib3V0U3RyaW5nUmVmcyA9IHt9O1xufVxuXG5mdW5jdGlvbiBoYXNWYWxpZFJlZihjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlnLnJlZiAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBoYXNWYWxpZEtleShjb25maWcpIHtcbiAge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ2tleScpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdrZXknKS5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29uZmlnLmtleSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdrZXknLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ1JlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICB7XG4gICAgICBpZiAoIXNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgICBlcnJvcignJXM6IGByZWZgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5mdW5jdGlvbiB3YXJuSWZTdHJpbmdSZWZDYW5ub3RCZUF1dG9Db252ZXJ0ZWQoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5yZWYgPT09ICdzdHJpbmcnICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgJiYgY29uZmlnLl9fc2VsZiAmJiBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnN0YXRlTm9kZSAhPT0gY29uZmlnLl9fc2VsZikge1xuICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG5cbiAgICAgIGlmICghZGlkV2FybkFib3V0U3RyaW5nUmVmc1tjb21wb25lbnROYW1lXSkge1xuICAgICAgICBlcnJvcignQ29tcG9uZW50IFwiJXNcIiBjb250YWlucyB0aGUgc3RyaW5nIHJlZiBcIiVzXCIuICcgKyAnU3VwcG9ydCBmb3Igc3RyaW5nIHJlZnMgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuICcgKyAnVGhpcyBjYXNlIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGNvbnZlcnRlZCB0byBhbiBhcnJvdyBmdW5jdGlvbi4gJyArICdXZSBhc2sgeW91IHRvIG1hbnVhbGx5IGZpeCB0aGlzIGNhc2UgYnkgdXNpbmcgdXNlUmVmKCkgb3IgY3JlYXRlUmVmKCkgaW5zdGVhZC4gJyArICdMZWFybiBtb3JlIGFib3V0IHVzaW5nIHJlZnMgc2FmZWx5IGhlcmU6ICcgKyAnaHR0cHM6Ly9mYi5tZS9yZWFjdC1zdHJpY3QtbW9kZS1zdHJpbmctcmVmJywgZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpLCBjb25maWcucmVmKTtcblxuICAgICAgICBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzW2NvbXBvbmVudE5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IFJlYWN0IGVsZW1lbnQuIFRoaXMgbm8gbG9uZ2VyIGFkaGVyZXMgdG9cbiAqIHRoZSBjbGFzcyBwYXR0ZXJuLCBzbyBkbyBub3QgdXNlIG5ldyB0byBjYWxsIGl0LiBBbHNvLCBpbnN0YW5jZW9mIGNoZWNrXG4gKiB3aWxsIG5vdCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBpbnRlcm5hbFxuICovXG5cblxudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3dzIHVzIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgYXMgYSBSZWFjdCBFbGVtZW50XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcbiAgICAvLyBCdWlsdC1pbiBwcm9wZXJ0aWVzIHRoYXQgYmVsb25nIG9uIHRoZSBlbGVtZW50XG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHJlZixcbiAgICBwcm9wczogcHJvcHMsXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9OyAvLyBUbyBtYWtlIGNvbXBhcmluZyBSZWFjdEVsZW1lbnRzIGVhc2llciBmb3IgdGVzdGluZyBwdXJwb3Nlcywgd2UgbWFrZVxuICAgIC8vIHRoZSB2YWxpZGF0aW9uIGZsYWcgbm9uLWVudW1lcmFibGUgKHdoZXJlIHBvc3NpYmxlLCB3aGljaCBzaG91bGRcbiAgICAvLyBpbmNsdWRlIGV2ZXJ5IGVudmlyb25tZW50IHdlIHJ1biB0ZXN0cyBpbiksIHNvIHRoZSB0ZXN0IGZyYW1ld29ya1xuICAgIC8vIGlnbm9yZXMgaXQuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudC5fc3RvcmUsICd2YWxpZGF0ZWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBmYWxzZVxuICAgIH0pOyAvLyBzZWxmIGFuZCBzb3VyY2UgYXJlIERFViBvbmx5IHByb3BlcnRpZXMuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zZWxmJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNlbGZcbiAgICB9KTsgLy8gVHdvIGVsZW1lbnRzIGNyZWF0ZWQgaW4gdHdvIGRpZmZlcmVudCBwbGFjZXMgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICAvLyBlcXVhbCBmb3IgdGVzdGluZyBwdXJwb3NlcyBhbmQgdGhlcmVmb3JlIHdlIGhpZGUgaXQgZnJvbSBlbnVtZXJhdGlvbi5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICB9KTtcblxuICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQucHJvcHMpO1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn07XG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCBvZiB0aGUgZ2l2ZW4gdHlwZS5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY3JlYXRlZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWU7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuICB2YXIgcHJvcHMgPSB7fTtcbiAgdmFyIGtleSA9IG51bGw7XG4gIHZhciByZWYgPSBudWxsO1xuICB2YXIgc2VsZiA9IG51bGw7XG4gIHZhciBzb3VyY2UgPSBudWxsO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuXG4gICAgICB7XG4gICAgICAgIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTsgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cblxuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuXG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGlmIChPYmplY3QuZnJlZXplKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9IC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuXG5cbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGRlZmF1bHRQcm9wcykge1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZikge1xuICAgICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xufVxuZnVuY3Rpb24gY2xvbmVBbmRSZXBsYWNlS2V5KG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudChvbGRFbGVtZW50LnR5cGUsIG5ld0tleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG9sZEVsZW1lbnQucHJvcHMpO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cbi8qKlxuICogQ2xvbmUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgdXNpbmcgZWxlbWVudCBhcyB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2Nsb25lZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGNsb25lRWxlbWVudChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIGlmICghIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHVuZGVmaW5lZCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJSZWFjdC5jbG9uZUVsZW1lbnQoLi4uKTogVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCBcIiArIGVsZW1lbnQgKyBcIi5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm9wTmFtZTsgLy8gT3JpZ2luYWwgcHJvcHMgYXJlIGNvcGllZFxuXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpOyAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG5cblxuICB2YXIga2V5ID0gZWxlbWVudC5rZXk7XG4gIHZhciByZWYgPSBlbGVtZW50LnJlZjsgLy8gU2VsZiBpcyBwcmVzZXJ2ZWQgc2luY2UgdGhlIG93bmVyIGlzIHByZXNlcnZlZC5cblxuICB2YXIgc2VsZiA9IGVsZW1lbnQuX3NlbGY7IC8vIFNvdXJjZSBpcyBwcmVzZXJ2ZWQgc2luY2UgY2xvbmVFbGVtZW50IGlzIHVubGlrZWx5IHRvIGJlIHRhcmdldGVkIGJ5IGFcbiAgLy8gdHJhbnNwaWxlciwgYW5kIHRoZSBvcmlnaW5hbCBzb3VyY2UgaXMgcHJvYmFibHkgYSBiZXR0ZXIgaW5kaWNhdG9yIG9mIHRoZVxuICAvLyB0cnVlIG93bmVyLlxuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7IC8vIE93bmVyIHdpbGwgYmUgcHJlc2VydmVkLCB1bmxlc3MgcmVmIGlzIG92ZXJyaWRkZW5cblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfSAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBvdmVycmlkZSBleGlzdGluZyBwcm9wc1xuXG5cbiAgICB2YXIgZGVmYXVsdFByb3BzO1xuXG4gICAgaWYgKGVsZW1lbnQudHlwZSAmJiBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgICBkZWZhdWx0UHJvcHMgPSBlbGVtZW50LnR5cGUuZGVmYXVsdFByb3BzO1xuICAgIH1cblxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cblxuXG4gIHZhciBjaGlsZHJlbkxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuXG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cblxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdEVsZW1lbnQoZWxlbWVudC50eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpO1xufVxuLyoqXG4gKiBWZXJpZmllcyB0aGUgb2JqZWN0IGlzIGEgUmVhY3RFbGVtZW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNpc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBAZmluYWxcbiAqL1xuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cblxudmFyIFNFUEFSQVRPUiA9ICcuJztcbnZhciBTVUJTRVBBUkFUT1IgPSAnOic7XG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuICByZXR1cm4gJyQnICsgZXNjYXBlZFN0cmluZztcbn1cbi8qKlxuICogVE9ETzogVGVzdCB0aGF0IGEgc2luZ2xlIGNoaWxkIGFuZCBhbiBhcnJheSB3aXRoIG9uZSBpdGVtIGhhdmUgdGhlIHNhbWUga2V5XG4gKiBwYXR0ZXJuLlxuICovXG5cblxudmFyIGRpZFdhcm5BYm91dE1hcHMgPSBmYWxzZTtcbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5cbmZ1bmN0aW9uIGVzY2FwZVVzZXJQcm92aWRlZEtleSh0ZXh0KSB7XG4gIHJldHVybiAoJycgKyB0ZXh0KS5yZXBsYWNlKHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LCAnJCYvJyk7XG59XG5cbnZhciBQT09MX1NJWkUgPSAxMDtcbnZhciB0cmF2ZXJzZUNvbnRleHRQb29sID0gW107XG5cbmZ1bmN0aW9uIGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChtYXBSZXN1bHQsIGtleVByZWZpeCwgbWFwRnVuY3Rpb24sIG1hcENvbnRleHQpIHtcbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IHRyYXZlcnNlQ29udGV4dFBvb2wucG9wKCk7XG4gICAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0ga2V5UHJlZml4O1xuICAgIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbWFwRnVuY3Rpb247XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRyYXZlcnNlQ29udGV4dDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBtYXBSZXN1bHQsXG4gICAgICBrZXlQcmVmaXg6IGtleVByZWZpeCxcbiAgICAgIGZ1bmM6IG1hcEZ1bmN0aW9uLFxuICAgICAgY29udGV4dDogbWFwQ29udGV4dCxcbiAgICAgIGNvdW50OiAwXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCkge1xuICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5mdW5jID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvbnRleHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuXG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCA8IFBPT0xfU0laRSkge1xuICAgIHRyYXZlcnNlQ29udGV4dFBvb2wucHVzaCh0cmF2ZXJzZUNvbnRleHQpO1xuICB9XG59XG4vKipcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHshc3RyaW5nfSBuYW1lU29GYXIgTmFtZSBvZiB0aGUga2V5IHBhdGggc28gZmFyLlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRvIGludm9rZSB3aXRoIGVhY2ggY2hpbGQgZm91bmQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgVXNlZCB0byBwYXNzIGluZm9ybWF0aW9uIHRocm91Z2hvdXQgdGhlIHRyYXZlcnNhbFxuICogcHJvY2Vzcy5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5cblxuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgdmFyIGludm9rZUNhbGxiYWNrID0gZmFsc2U7XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsKSB7XG4gICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG4gIH1cblxuICBpZiAoaW52b2tlQ2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkcmVuLCAvLyBJZiBpdCdzIHRoZSBvbmx5IGNoaWxkLCB0cmVhdCB0aGUgbmFtZSBhcyBpZiBpdCB3YXMgd3JhcHBlZCBpbiBhbiBhcnJheVxuICAgIC8vIHNvIHRoYXQgaXQncyBjb25zaXN0ZW50IGlmIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gZ3Jvd3MuXG4gICAgbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiArIGdldENvbXBvbmVudEtleShjaGlsZHJlbiwgMCkgOiBuYW1lU29GYXIpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIGNoaWxkO1xuICB2YXIgbmV4dE5hbWU7XG4gIHZhciBzdWJ0cmVlQ291bnQgPSAwOyAvLyBDb3VudCBvZiBjaGlsZHJlbiBmb3VuZCBpbiB0aGUgY3VycmVudCBzdWJ0cmVlLlxuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG5cbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcblxuICAgICAge1xuICAgICAgICAvLyBXYXJuIGFib3V0IHVzaW5nIE1hcHMgYXMgY2hpbGRyZW5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gPT09IGNoaWxkcmVuLmVudHJpZXMpIHtcbiAgICAgICAgICBpZiAoIWRpZFdhcm5BYm91dE1hcHMpIHtcbiAgICAgICAgICAgIHdhcm4oJ1VzaW5nIE1hcHMgYXMgY2hpbGRyZW4gaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gQ29uc2lkZXIgY29udmVydGluZyBjaGlsZHJlbiB0byAnICsgJ2FuIGFycmF5IG9mIGtleWVkIFJlYWN0RWxlbWVudHMgaW5zdGVhZC4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwoY2hpbGRyZW4pO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaWkgPSAwO1xuXG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGNoaWxkID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBhZGRlbmR1bSA9ICcnO1xuXG4gICAgICB7XG4gICAgICAgIGFkZGVuZHVtID0gJyBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5ICcgKyAnaW5zdGVhZC4nICsgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9ICcnICsgY2hpbGRyZW47XG5cbiAgICAgIHtcbiAgICAgICAge1xuICAgICAgICAgIHRocm93IEVycm9yKCBcIk9iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogXCIgKyAoY2hpbGRyZW5TdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gJ29iamVjdCB3aXRoIGtleXMgeycgKyBPYmplY3Qua2V5cyhjaGlsZHJlbikuam9pbignLCAnKSArICd9JyA6IGNoaWxkcmVuU3RyaW5nKSArIFwiKS5cIiArIGFkZGVuZHVtICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3VidHJlZUNvdW50O1xufVxuLyoqXG4gKiBUcmF2ZXJzZXMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLCBidXRcbiAqIG1pZ2h0IGFsc28gYmUgc3BlY2lmaWVkIHRocm91Z2ggYXR0cmlidXRlczpcbiAqXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4sIC4uLilgXG4gKiAtIGB0cmF2ZXJzZUFsbENoaWxkcmVuKHRoaXMucHJvcHMubGVmdFBhbmVsQ2hpbGRyZW4sIC4uLilgXG4gKlxuICogVGhlIGB0cmF2ZXJzZUNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHRoYXQgaXMgcGFzc2VkIHRocm91Z2ggdGhlXG4gKiBlbnRpcmUgdHJhdmVyc2FsLiBJdCBjYW4gYmUgdXNlZCB0byBzdG9yZSBhY2N1bXVsYXRpb25zIG9yIGFueXRoaW5nIGVsc2UgdGhhdFxuICogdGhlIGNhbGxiYWNrIG1pZ2h0IGZpbmQgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBvYmplY3QuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgVG8gaW52b2tlIHVwb24gdHJhdmVyc2luZyBlYWNoIGNoaWxkLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IENvbnRleHQgZm9yIHRyYXZlcnNhbC5cbiAqIEByZXR1cm4geyFudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhpcyBzdWJ0cmVlLlxuICovXG5cblxuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnRLZXkoY29tcG9uZW50LCBpbmRleCkge1xuICAvLyBEbyBzb21lIHR5cGVjaGVja2luZyBoZXJlIHNpbmNlIHdlIGNhbGwgdGhpcyBibGluZGx5LiBXZSB3YW50IHRvIGVuc3VyZVxuICAvLyB0aGF0IHdlIGRvbid0IGJsb2NrIHBvdGVudGlhbCBmdXR1cmUgRVMgQVBJcy5cbiAgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudCAhPT0gbnVsbCAmJiBjb21wb25lbnQua2V5ICE9IG51bGwpIHtcbiAgICAvLyBFeHBsaWNpdCBrZXlcbiAgICByZXR1cm4gZXNjYXBlKGNvbXBvbmVudC5rZXkpO1xuICB9IC8vIEltcGxpY2l0IGtleSBkZXRlcm1pbmVkIGJ5IHRoZSBpbmRleCBpbiB0aGUgc2V0XG5cblxuICByZXR1cm4gaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoU2luZ2xlQ2hpbGQoYm9va0tlZXBpbmcsIGNoaWxkLCBuYW1lKSB7XG4gIHZhciBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuICBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xufVxuLyoqXG4gKiBJdGVyYXRlcyB0aHJvdWdoIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5cblxuZnVuY3Rpb24gZm9yRWFjaENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG51bGwsIG51bGwsIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hTaW5nbGVDaGlsZCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdCxcbiAgICAgIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeCxcbiAgICAgIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG4gIHZhciBtYXBwZWRDaGlsZCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobWFwcGVkQ2hpbGQpKSB7XG4gICAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChtYXBwZWRDaGlsZCwgcmVzdWx0LCBjaGlsZEtleSwgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHJldHVybiBjO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoaXNWYWxpZEVsZW1lbnQobWFwcGVkQ2hpbGQpKSB7XG4gICAgICBtYXBwZWRDaGlsZCA9IGNsb25lQW5kUmVwbGFjZUtleShtYXBwZWRDaGlsZCwgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKG1hcHBlZENoaWxkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCBhcnJheSwgcHJlZml4LCBmdW5jLCBjb250ZXh0KSB7XG4gIHZhciBlc2NhcGVkUHJlZml4ID0gJyc7XG5cbiAgaWYgKHByZWZpeCAhPSBudWxsKSB7XG4gICAgZXNjYXBlZFByZWZpeCA9IGVzY2FwZVVzZXJQcm92aWRlZEtleShwcmVmaXgpICsgJy8nO1xuICB9XG5cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cbi8qKlxuICogTWFwcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBrZXksIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuXG5cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmMsIGNvbnRleHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXNcbiAqIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuXG5cbmZ1bmN0aW9uIGNvdW50Q2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgbnVsbCk7XG59XG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbnRvYXJyYXlcbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZDtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiBhbmQgdmVyaWZpZXMgdGhhdCB0aGVyZVxuICogaXMgb25seSBvbmUgY2hpbGQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVub25seVxuICpcbiAqIFRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGEgc2luZ2xlIGNoaWxkIGdldHNcbiAqIHBhc3NlZCB3aXRob3V0IGEgd3JhcHBlciwgYnV0IHRoZSBwdXJwb3NlIG9mIHRoaXMgaGVscGVyIGZ1bmN0aW9uIGlzIHRvXG4gKiBhYnN0cmFjdCBhd2F5IHRoZSBwYXJ0aWN1bGFyIHN0cnVjdHVyZSBvZiBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IGNoaWxkcmVuIENoaWxkIGNvbGxlY3Rpb24gc3RydWN0dXJlLlxuICogQHJldHVybiB7UmVhY3RFbGVtZW50fSBUaGUgZmlyc3QgYW5kIG9ubHkgYFJlYWN0RWxlbWVudGAgY29udGFpbmVkIGluIHRoZVxuICogc3RydWN0dXJlLlxuICovXG5cblxuZnVuY3Rpb24gb25seUNoaWxkKGNoaWxkcmVuKSB7XG4gIGlmICghaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwiUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuXCIgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZGVmYXVsdFZhbHVlLCBjYWxjdWxhdGVDaGFuZ2VkQml0cykge1xuICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGNhbGN1bGF0ZUNoYW5nZWRCaXRzID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB7XG4gICAgICBpZiAoY2FsY3VsYXRlQ2hhbmdlZEJpdHMgIT09IG51bGwgJiYgdHlwZW9mIGNhbGN1bGF0ZUNoYW5nZWRCaXRzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVycm9yKCdjcmVhdGVDb250ZXh0OiBFeHBlY3RlZCB0aGUgb3B0aW9uYWwgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIGEgJyArICdmdW5jdGlvbi4gSW5zdGVhZCByZWNlaXZlZDogJXMnLCBjYWxjdWxhdGVDaGFuZ2VkQml0cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNhbGN1bGF0ZUNoYW5nZWRCaXRzLFxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCB0byBzdXBwb3J0IG11bHRpcGxlIGNvbmN1cnJlbnQgcmVuZGVyZXJzLCB3ZSBjYXRlZ29yaXplXG4gICAgLy8gc29tZSByZW5kZXJlcnMgYXMgcHJpbWFyeSBhbmQgb3RoZXJzIGFzIHNlY29uZGFyeS4gV2Ugb25seSBleHBlY3RcbiAgICAvLyB0aGVyZSB0byBiZSB0d28gY29uY3VycmVudCByZW5kZXJlcnMgYXQgbW9zdDogUmVhY3QgTmF0aXZlIChwcmltYXJ5KSBhbmRcbiAgICAvLyBGYWJyaWMgKHNlY29uZGFyeSk7IFJlYWN0IERPTSAocHJpbWFyeSkgYW5kIFJlYWN0IEFSVCAoc2Vjb25kYXJ5KS5cbiAgICAvLyBTZWNvbmRhcnkgcmVuZGVyZXJzIHN0b3JlIHRoZWlyIGNvbnRleHQgdmFsdWVzIG9uIHNlcGFyYXRlIGZpZWxkcy5cbiAgICBfY3VycmVudFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgX2N1cnJlbnRWYWx1ZTI6IGRlZmF1bHRWYWx1ZSxcbiAgICAvLyBVc2VkIHRvIHRyYWNrIGhvdyBtYW55IGNvbmN1cnJlbnQgcmVuZGVyZXJzIHRoaXMgY29udGV4dCBjdXJyZW50bHlcbiAgICAvLyBzdXBwb3J0cyB3aXRoaW4gaW4gYSBzaW5nbGUgcmVuZGVyZXIuIFN1Y2ggYXMgcGFyYWxsZWwgc2VydmVyIHJlbmRlcmluZy5cbiAgICBfdGhyZWFkQ291bnQ6IDAsXG4gICAgLy8gVGhlc2UgYXJlIGNpcmN1bGFyXG4gICAgUHJvdmlkZXI6IG51bGwsXG4gICAgQ29uc3VtZXI6IG51bGxcbiAgfTtcbiAgY29udGV4dC5Qcm92aWRlciA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfUFJPVklERVJfVFlQRSxcbiAgICBfY29udGV4dDogY29udGV4dFxuICB9O1xuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSBmYWxzZTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gZmFsc2U7XG5cbiAge1xuICAgIC8vIEEgc2VwYXJhdGUgb2JqZWN0LCBidXQgcHJveGllcyBiYWNrIHRvIHRoZSBvcmlnaW5hbCBjb250ZXh0IG9iamVjdCBmb3JcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gSXQgaGFzIGEgZGlmZmVyZW50ICQkdHlwZW9mLCBzbyB3ZSBjYW4gcHJvcGVybHlcbiAgICAvLyB3YXJuIGZvciB0aGUgaW5jb3JyZWN0IHVzYWdlIG9mIENvbnRleHQgYXMgYSBDb25zdW1lci5cbiAgICB2YXIgQ29uc3VtZXIgPSB7XG4gICAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgICAgX2NvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfY2FsY3VsYXRlQ2hhbmdlZEJpdHM6IGNvbnRleHQuX2NhbGN1bGF0ZUNoYW5nZWRCaXRzXG4gICAgfTsgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbm90IHNldHRpbmcgYSB2YWx1ZSwgd2hpY2ggaXMgaW50ZW50aW9uYWwgaGVyZVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ29uc3VtZXIsIHtcbiAgICAgIFByb3ZpZGVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyID0gdHJ1ZTtcblxuICAgICAgICAgICAgZXJyb3IoJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Qcm92aWRlcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Qcm92aWRlcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Qcm92aWRlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX1Byb3ZpZGVyKSB7XG4gICAgICAgICAgY29udGV4dC5Qcm92aWRlciA9IF9Qcm92aWRlcjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZSA9IF9jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlMjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlMjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX2N1cnJlbnRWYWx1ZTIpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUyID0gX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfdGhyZWFkQ291bnQ6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX3RocmVhZENvdW50O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfdGhyZWFkQ291bnQpIHtcbiAgICAgICAgICBjb250ZXh0Ll90aHJlYWRDb3VudCA9IF90aHJlYWRDb3VudDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENvbnN1bWVyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMpIHtcbiAgICAgICAgICAgIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gdHJ1ZTtcblxuICAgICAgICAgICAgZXJyb3IoJ1JlbmRlcmluZyA8Q29udGV4dC5Db25zdW1lci5Db25zdW1lcj4gaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIHJlbmRlciA8Q29udGV4dC5Db25zdW1lcj4gaW5zdGVhZD8nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY29udGV4dC5Db25zdW1lcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pOyAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBtaXNzaW5nIHByb3BlcnRpZXMgYmVjYXVzZSBpdCBkb2Vzbid0IHVuZGVyc3RhbmQgZGVmaW5lUHJvcGVydHlcblxuICAgIGNvbnRleHQuQ29uc3VtZXIgPSBDb25zdW1lcjtcbiAgfVxuXG4gIHtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIgPSBudWxsO1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlcjIgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGxhenkoY3Rvcikge1xuICB2YXIgbGF6eVR5cGUgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0xBWllfVFlQRSxcbiAgICBfY3RvcjogY3RvcixcbiAgICAvLyBSZWFjdCB1c2VzIHRoZXNlIGZpZWxkcyB0byBzdG9yZSB0aGUgcmVzdWx0LlxuICAgIF9zdGF0dXM6IC0xLFxuICAgIF9yZXN1bHQ6IG51bGxcbiAgfTtcblxuICB7XG4gICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhpcyB3b3VsZCBqdXN0IHNldCBpdCBvbiB0aGUgb2JqZWN0LlxuICAgIHZhciBkZWZhdWx0UHJvcHM7XG4gICAgdmFyIHByb3BUeXBlcztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhsYXp5VHlwZSwge1xuICAgICAgZGVmYXVsdFByb3BzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZmF1bHRQcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3RGVmYXVsdFByb3BzKSB7XG4gICAgICAgICAgZXJyb3IoJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYGRlZmF1bHRQcm9wc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcblxuICAgICAgICAgIGRlZmF1bHRQcm9wcyA9IG5ld0RlZmF1bHRQcm9wczsgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdkZWZhdWx0UHJvcHMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFR5cGVzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdQcm9wVHlwZXMpIHtcbiAgICAgICAgICBlcnJvcignUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgcHJvcFR5cGVzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuXG4gICAgICAgICAgcHJvcFR5cGVzID0gbmV3UHJvcFR5cGVzOyAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcblxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ3Byb3BUeXBlcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGxhenlUeXBlO1xufVxuXG5mdW5jdGlvbiBmb3J3YXJkUmVmKHJlbmRlcikge1xuICB7XG4gICAgaWYgKHJlbmRlciAhPSBudWxsICYmIHJlbmRlci4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSB7XG4gICAgICBlcnJvcignZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgcmVjZWl2ZWQgYSBgbWVtb2AgJyArICdjb21wb25lbnQuIEluc3RlYWQgb2YgZm9yd2FyZFJlZihtZW1vKC4uLikpLCB1c2UgJyArICdtZW1vKGZvcndhcmRSZWYoLi4uKSkuJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBlcnJvcignZm9yd2FyZFJlZiByZXF1aXJlcyBhIHJlbmRlciBmdW5jdGlvbiBidXQgd2FzIGdpdmVuICVzLicsIHJlbmRlciA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiByZW5kZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVuZGVyLmxlbmd0aCAhPT0gMCAmJiByZW5kZXIubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgYWNjZXB0IGV4YWN0bHkgdHdvIHBhcmFtZXRlcnM6IHByb3BzIGFuZCByZWYuICVzJywgcmVuZGVyLmxlbmd0aCA9PT0gMSA/ICdEaWQgeW91IGZvcmdldCB0byB1c2UgdGhlIHJlZiBwYXJhbWV0ZXI/JyA6ICdBbnkgYWRkaXRpb25hbCBwYXJhbWV0ZXIgd2lsbCBiZSB1bmRlZmluZWQuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlbmRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVuZGVyLmRlZmF1bHRQcm9wcyAhPSBudWxsIHx8IHJlbmRlci5wcm9wVHlwZXMgIT0gbnVsbCkge1xuICAgICAgICBlcnJvcignZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGRvIG5vdCBzdXBwb3J0IHByb3BUeXBlcyBvciBkZWZhdWx0UHJvcHMuICcgKyAnRGlkIHlvdSBhY2NpZGVudGFsbHkgcGFzcyBhIFJlYWN0IGNvbXBvbmVudD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFLFxuICAgIHJlbmRlcjogcmVuZGVyXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgLy8gTm90ZTogaXRzIHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIGlmIGl0J3MgYSBwb2x5ZmlsbC5cbiAgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1JFU1BPTkRFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1NDT1BFX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIG1lbW8odHlwZSwgY29tcGFyZSkge1xuICB7XG4gICAgaWYgKCFpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkpIHtcbiAgICAgIGVycm9yKCdtZW1vOiBUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIGNvbXBvbmVudC4gSW5zdGVhZCAnICsgJ3JlY2VpdmVkOiAlcycsIHR5cGUgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTUVNT19UWVBFLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgY29tcGFyZTogY29tcGFyZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbXBhcmVcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURpc3BhdGNoZXIoKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50O1xuXG4gIGlmICghKGRpc3BhdGNoZXIgIT09IG51bGwpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwiSW52YWxpZCBob29rIGNhbGwuIEhvb2tzIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGJvZHkgb2YgYSBmdW5jdGlvbiBjb21wb25lbnQuIFRoaXMgY291bGQgaGFwcGVuIGZvciBvbmUgb2YgdGhlIGZvbGxvd2luZyByZWFzb25zOlxcbjEuIFlvdSBtaWdodCBoYXZlIG1pc21hdGNoaW5nIHZlcnNpb25zIG9mIFJlYWN0IGFuZCB0aGUgcmVuZGVyZXIgKHN1Y2ggYXMgUmVhY3QgRE9NKVxcbjIuIFlvdSBtaWdodCBiZSBicmVha2luZyB0aGUgUnVsZXMgb2YgSG9va3NcXG4zLiBZb3UgbWlnaHQgaGF2ZSBtb3JlIHRoYW4gb25lIGNvcHkgb2YgUmVhY3QgaW4gdGhlIHNhbWUgYXBwXFxuU2VlIGh0dHBzOi8vZmIubWUvcmVhY3QtaW52YWxpZC1ob29rLWNhbGwgZm9yIHRpcHMgYWJvdXQgaG93IHRvIGRlYnVnIGFuZCBmaXggdGhpcyBwcm9ibGVtLlwiICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRpc3BhdGNoZXI7XG59XG5cbmZ1bmN0aW9uIHVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcblxuICB7XG4gICAgaWYgKHVuc3RhYmxlX29ic2VydmVkQml0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvcigndXNlQ29udGV4dCgpIHNlY29uZCBhcmd1bWVudCBpcyByZXNlcnZlZCBmb3IgZnV0dXJlICcgKyAndXNlIGluIFJlYWN0LiBQYXNzaW5nIGl0IGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnWW91IHBhc3NlZDogJXMuJXMnLCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMsIHR5cGVvZiB1bnN0YWJsZV9vYnNlcnZlZEJpdHMgPT09ICdudW1iZXInICYmIEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzJdKSA/ICdcXG5cXG5EaWQgeW91IGNhbGwgYXJyYXkubWFwKHVzZUNvbnRleHQpPyAnICsgJ0NhbGxpbmcgSG9va3MgaW5zaWRlIGEgbG9vcCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0xlYXJuIG1vcmUgYXQgaHR0cHM6Ly9mYi5tZS9ydWxlcy1vZi1ob29rcycgOiAnJyk7XG4gICAgfSAvLyBUT0RPOiBhZGQgYSBtb3JlIGdlbmVyaWMgd2FybmluZyBmb3IgaW52YWxpZCB2YWx1ZXMuXG5cblxuICAgIGlmIChDb250ZXh0Ll9jb250ZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciByZWFsQ29udGV4dCA9IENvbnRleHQuX2NvbnRleHQ7IC8vIERvbid0IGRlZHVwbGljYXRlIGJlY2F1c2UgdGhpcyBsZWdpdGltYXRlbHkgY2F1c2VzIGJ1Z3NcbiAgICAgIC8vIGFuZCBub2JvZHkgc2hvdWxkIGJlIHVzaW5nIHRoaXMgaW4gZXhpc3RpbmcgY29kZS5cblxuICAgICAgaWYgKHJlYWxDb250ZXh0LkNvbnN1bWVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIGVycm9yKCdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Db25zdW1lcikgaXMgbm90IHN1cHBvcnRlZCwgbWF5IGNhdXNlIGJ1Z3MsIGFuZCB3aWxsIGJlICcgKyAncmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9IGVsc2UgaWYgKHJlYWxDb250ZXh0LlByb3ZpZGVyID09PSBDb250ZXh0KSB7XG4gICAgICAgIGVycm9yKCdDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Qcm92aWRlcikgaXMgbm90IHN1cHBvcnRlZC4gJyArICdEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpO1xufVxuZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbn1cbmZ1bmN0aW9uIHVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCk7XG59XG5mdW5jdGlvbiB1c2VSZWYoaW5pdGlhbFZhbHVlKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVmKGluaXRpYWxWYWx1ZSk7XG59XG5mdW5jdGlvbiB1c2VFZmZlY3QoY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VDYWxsYmFjayhjYWxsYmFjaywgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZU1lbW8oY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlTWVtbyhjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pIHtcbiAge1xuICAgIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgICByZXR1cm4gZGlzcGF0Y2hlci51c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbik7XG4gIH1cbn1cblxudmFyIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duO1xuXG57XG4gIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpIHtcbiAgaWYgKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShzb3VyY2UpIHtcbiAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgeW91ciBjb2RlIGF0ICcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnLic7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMoZWxlbWVudFByb3BzKSB7XG4gIGlmIChlbGVtZW50UHJvcHMgIT09IG51bGwgJiYgZWxlbWVudFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oZWxlbWVudFByb3BzLl9fc291cmNlKTtcbiAgfVxuXG4gIHJldHVybiAnJztcbn1cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG5cblxudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAgdmFyIGluZm8gPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcblxuICBpZiAoIWluZm8pIHtcbiAgICB2YXIgcGFyZW50TmFtZSA9IHR5cGVvZiBwYXJlbnRUeXBlID09PSAnc3RyaW5nJyA/IHBhcmVudFR5cGUgOiBwYXJlbnRUeXBlLmRpc3BsYXlOYW1lIHx8IHBhcmVudFR5cGUubmFtZTtcblxuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICBpbmZvID0gXCJcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDxcIiArIHBhcmVudE5hbWUgKyBcIj4uXCI7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZm87XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGFuIGV4cGxpY2l0IGtleSBhc3NpZ25lZCB0byBpdC5cbiAqIFRoaXMgZWxlbWVudCBpcyBpbiBhbiBhcnJheS4gVGhlIGFycmF5IGNvdWxkIGdyb3cgYW5kIHNocmluayBvciBiZVxuICogcmVvcmRlcmVkLiBBbGwgY2hpbGRyZW4gdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiB2YWxpZGF0ZWQgYXJlIHJlcXVpcmVkIHRvXG4gKiBoYXZlIGEgXCJrZXlcIiBwcm9wZXJ0eSBhc3NpZ25lZCB0byBpdC4gRXJyb3Igc3RhdHVzZXMgYXJlIGNhY2hlZCBzbyBhIHdhcm5pbmdcbiAqIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB0aGF0IHJlcXVpcmVzIGEga2V5LlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIGVsZW1lbnQncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVFeHBsaWNpdEtleShlbGVtZW50LCBwYXJlbnRUeXBlKSB7XG4gIGlmICghZWxlbWVudC5fc3RvcmUgfHwgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkIHx8IGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG5cbiAgaWYgKG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG93bmVySGFzS2V5VXNlV2FybmluZ1tjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7IC8vIFVzdWFsbHkgdGhlIGN1cnJlbnQgb3duZXIgaXMgdGhlIG9mZmVuZGVyLCBidXQgaWYgaXQgYWNjZXB0cyBjaGlsZHJlbiBhcyBhXG4gIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgLy8gYXNzaWduaW5nIGl0IGEga2V5LlxuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG5cbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5fb3duZXIgJiYgZWxlbWVudC5fb3duZXIgIT09IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjb21wb25lbnQgdGhhdCBvcmlnaW5hbGx5IGNyZWF0ZWQgdGhpcyBjaGlsZC5cbiAgICBjaGlsZE93bmVyID0gXCIgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gXCIgKyBnZXRDb21wb25lbnROYW1lKGVsZW1lbnQuX293bmVyLnR5cGUpICsgXCIuXCI7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcblxuICB7XG4gICAgZXJyb3IoJ0VhY2ggY2hpbGQgaW4gYSBsaXN0IHNob3VsZCBoYXZlIGEgdW5pcXVlIFwia2V5XCIgcHJvcC4nICsgJyVzJXMgU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1rZXlzIGZvciBtb3JlIGluZm9ybWF0aW9uLicsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIpO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG59XG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUsIHBhcmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBub2RlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuXG4gICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoY2hpbGQpKSB7XG4gICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoY2hpbGQsIHBhcmVudFR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgaWYgKG5vZGUuX3N0b3JlKSB7XG4gICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuXG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBFbnRyeSBpdGVyYXRvcnMgdXNlZCB0byBwcm92aWRlIGltcGxpY2l0IGtleXMsXG4gICAgICAvLyBidXQgbm93IHdlIHByaW50IGEgc2VwYXJhdGUgd2FybmluZyBmb3IgdGhlbSBsYXRlci5cbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcDtcblxuICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KHN0ZXAudmFsdWUsIHBhcmVudFR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAge1xuICAgIHZhciB0eXBlID0gZWxlbWVudC50eXBlO1xuXG4gICAgaWYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZSh0eXBlKTtcbiAgICB2YXIgcHJvcFR5cGVzO1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCAvLyBOb3RlOiBNZW1vIG9ubHkgY2hlY2tzIG91dGVyIHByb3BzIGhlcmUuXG4gICAgLy8gSW5uZXIgcHJvcHMgYXJlIGNoZWNrZWQgaW4gdGhlIHJlY29uY2lsZXIuXG4gICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFKSkge1xuICAgICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcFR5cGVzKSB7XG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KTtcbiAgICAgIGNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0pO1xuICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlLlByb3BUeXBlcyAhPT0gdW5kZWZpbmVkICYmICFwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bikge1xuICAgICAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICBlcnJvcignQ29tcG9uZW50ICVzIGRlY2xhcmVkIGBQcm9wVHlwZXNgIGluc3RlYWQgb2YgYHByb3BUeXBlc2AuIERpZCB5b3UgbWlzc3BlbGwgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnQ/JywgbmFtZSB8fCAnVW5rbm93bicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdHlwZS5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicgJiYgIXR5cGUuZ2V0RGVmYXVsdFByb3BzLmlzUmVhY3RDbGFzc0FwcHJvdmVkKSB7XG4gICAgICBlcnJvcignZ2V0RGVmYXVsdFByb3BzIGlzIG9ubHkgdXNlZCBvbiBjbGFzc2ljIFJlYWN0LmNyZWF0ZUNsYXNzICcgKyAnZGVmaW5pdGlvbnMuIFVzZSBhIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBgZGVmYXVsdFByb3BzYCBpbnN0ZWFkLicpO1xuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhIGZyYWdtZW50LCB2YWxpZGF0ZSB0aGF0IGl0IGNhbiBvbmx5IGJlIHByb3ZpZGVkIHdpdGggZnJhZ21lbnQgcHJvcHNcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBmcmFnbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVGcmFnbWVudFByb3BzKGZyYWdtZW50KSB7XG4gIHtcbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChmcmFnbWVudCk7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhmcmFnbWVudC5wcm9wcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuXG4gICAgICBpZiAoa2V5ICE9PSAnY2hpbGRyZW4nICYmIGtleSAhPT0gJ2tleScpIHtcbiAgICAgICAgZXJyb3IoJ0ludmFsaWQgcHJvcCBgJXNgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuICcgKyAnUmVhY3QuRnJhZ21lbnQgY2FuIG9ubHkgaGF2ZSBga2V5YCBhbmQgYGNoaWxkcmVuYCBwcm9wcy4nLCBrZXkpO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmcmFnbWVudC5yZWYgIT09IG51bGwpIHtcbiAgICAgIGVycm9yKCdJbnZhbGlkIGF0dHJpYnV0ZSBgcmVmYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLicpO1xuICAgIH1cblxuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICB9XG59XG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24odHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciB2YWxpZFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSk7IC8vIFdlIHdhcm4gaW4gdGhpcyBjYXNlIGJ1dCBkb24ndCB0aHJvdy4gV2UgZXhwZWN0IHRoZSBlbGVtZW50IGNyZWF0aW9uIHRvXG4gIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG5cbiAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuXG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyh0eXBlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUluZm8gPSBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bUZvclByb3BzKHByb3BzKTtcblxuICAgIGlmIChzb3VyY2VJbmZvKSB7XG4gICAgICBpbmZvICs9IHNvdXJjZUluZm87XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZm8gKz0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGVTdHJpbmc7XG5cbiAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgdHlwZVN0cmluZyA9ICdudWxsJztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHlwZSkpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnYXJyYXknO1xuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gdW5kZWZpbmVkICYmIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSkge1xuICAgICAgdHlwZVN0cmluZyA9IFwiPFwiICsgKGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKSB8fCAnVW5rbm93bicpICsgXCIgLz5cIjtcbiAgICAgIGluZm8gPSAnIERpZCB5b3UgYWNjaWRlbnRhbGx5IGV4cG9ydCBhIEpTWCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjb21wb25lbnQ/JztcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZVN0cmluZyA9IHR5cGVvZiB0eXBlO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGVycm9yKCdSZWFjdC5jcmVhdGVFbGVtZW50OiB0eXBlIGlzIGludmFsaWQgLS0gZXhwZWN0ZWQgYSBzdHJpbmcgKGZvciAnICsgJ2J1aWx0LWluIGNvbXBvbmVudHMpIG9yIGEgY2xhc3MvZnVuY3Rpb24gKGZvciBjb21wb3NpdGUgJyArICdjb21wb25lbnRzKSBidXQgZ290OiAlcy4lcycsIHR5cGVTdHJpbmcsIGluZm8pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyAvLyBUaGUgcmVzdWx0IGNhbiBiZSBudWxsaXNoIGlmIGEgbW9jayBvciBhIGN1c3RvbSBmdW5jdGlvbiBpcyB1c2VkLlxuICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9IC8vIFNraXAga2V5IHdhcm5pbmcgaWYgdGhlIHR5cGUgaXNuJ3QgdmFsaWQgc2luY2Ugb3VyIGtleSB2YWxpZGF0aW9uIGxvZ2ljXG4gIC8vIGRvZXNuJ3QgZXhwZWN0IGEgbm9uLXN0cmluZy9mdW5jdGlvbiB0eXBlIGFuZCBjYW4gdGhyb3cgY29uZnVzaW5nIGVycm9ycy5cbiAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAvLyAoUmVuZGVyaW5nIHdpbGwgdGhyb3cgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZSBhbmQgYXMgc29vbiBhcyB0aGUgdHlwZSBpc1xuICAvLyBmaXhlZCwgdGhlIGtleSB3YXJuaW5ncyB3aWxsIGFwcGVhci4pXG5cblxuICBpZiAodmFsaWRUeXBlKSB7XG4gICAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUpIHtcbiAgICB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZWxlbWVudCk7XG4gIH0gZWxzZSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cbnZhciBkaWRXYXJuQWJvdXREZXByZWNhdGVkQ3JlYXRlRmFjdG9yeSA9IGZhbHNlO1xuZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uKHR5cGUpIHtcbiAgdmFyIHZhbGlkYXRlZEZhY3RvcnkgPSBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24uYmluZChudWxsLCB0eXBlKTtcbiAgdmFsaWRhdGVkRmFjdG9yeS50eXBlID0gdHlwZTtcblxuICB7XG4gICAgaWYgKCFkaWRXYXJuQWJvdXREZXByZWNhdGVkQ3JlYXRlRmFjdG9yeSkge1xuICAgICAgZGlkV2FybkFib3V0RGVwcmVjYXRlZENyZWF0ZUZhY3RvcnkgPSB0cnVlO1xuXG4gICAgICB3YXJuKCdSZWFjdC5jcmVhdGVGYWN0b3J5KCkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluICcgKyAnYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gQ29uc2lkZXIgdXNpbmcgSlNYICcgKyAnb3IgdXNlIFJlYWN0LmNyZWF0ZUVsZW1lbnQoKSBkaXJlY3RseSBpbnN0ZWFkLicpO1xuICAgIH0gLy8gTGVnYWN5IGhvb2s6IHJlbW92ZSBpdFxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsaWRhdGVkRmFjdG9yeSwgJ3R5cGUnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB3YXJuKCdGYWN0b3J5LnR5cGUgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHRoZSBjbGFzcyBkaXJlY3RseSAnICsgJ2JlZm9yZSBwYXNzaW5nIGl0IHRvIGNyZWF0ZUZhY3RvcnkuJyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0eXBlJywge1xuICAgICAgICAgIHZhbHVlOiB0eXBlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB2YWxpZGF0ZWRGYWN0b3J5O1xufVxuZnVuY3Rpb24gY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24oZWxlbWVudCwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gIHZhciBuZXdFbGVtZW50ID0gY2xvbmVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgZm9yICh2YXIgaSA9IDI7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIG5ld0VsZW1lbnQudHlwZSk7XG4gIH1cblxuICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG5cbntcblxuICB0cnkge1xuICAgIHZhciBmcm96ZW5PYmplY3QgPSBPYmplY3QuZnJlZXplKHt9KTtcbiAgICB2YXIgdGVzdE1hcCA9IG5ldyBNYXAoW1tmcm96ZW5PYmplY3QsIG51bGxdXSk7XG4gICAgdmFyIHRlc3RTZXQgPSBuZXcgU2V0KFtmcm96ZW5PYmplY3RdKTsgLy8gVGhpcyBpcyBuZWNlc3NhcnkgZm9yIFJvbGx1cCB0byBub3QgY29uc2lkZXIgdGhlc2UgdW51c2VkLlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xNzcxXG4gICAgLy8gVE9ETzogd2UgY2FuIHJlbW92ZSB0aGVzZSBpZiBSb2xsdXAgZml4ZXMgdGhlIGJ1Zy5cblxuICAgIHRlc3RNYXAuc2V0KDAsIDApO1xuICAgIHRlc3RTZXQuYWRkKDApO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbn1cblxudmFyIGNyZWF0ZUVsZW1lbnQkMSA9ICBjcmVhdGVFbGVtZW50V2l0aFZhbGlkYXRpb24gO1xudmFyIGNsb25lRWxlbWVudCQxID0gIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uIDtcbnZhciBjcmVhdGVGYWN0b3J5ID0gIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbiA7XG52YXIgQ2hpbGRyZW4gPSB7XG4gIG1hcDogbWFwQ2hpbGRyZW4sXG4gIGZvckVhY2g6IGZvckVhY2hDaGlsZHJlbixcbiAgY291bnQ6IGNvdW50Q2hpbGRyZW4sXG4gIHRvQXJyYXk6IHRvQXJyYXksXG4gIG9ubHk6IG9ubHlDaGlsZFxufTtcblxuZXhwb3J0cy5DaGlsZHJlbiA9IENoaWxkcmVuO1xuZXhwb3J0cy5Db21wb25lbnQgPSBDb21wb25lbnQ7XG5leHBvcnRzLkZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbmV4cG9ydHMuUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuZXhwb3J0cy5QdXJlQ29tcG9uZW50ID0gUHVyZUNvbXBvbmVudDtcbmV4cG9ydHMuU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG5leHBvcnRzLlN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbmV4cG9ydHMuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQgPSBSZWFjdFNoYXJlZEludGVybmFscztcbmV4cG9ydHMuY2xvbmVFbGVtZW50ID0gY2xvbmVFbGVtZW50JDE7XG5leHBvcnRzLmNyZWF0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0O1xuZXhwb3J0cy5jcmVhdGVFbGVtZW50ID0gY3JlYXRlRWxlbWVudCQxO1xuZXhwb3J0cy5jcmVhdGVGYWN0b3J5ID0gY3JlYXRlRmFjdG9yeTtcbmV4cG9ydHMuY3JlYXRlUmVmID0gY3JlYXRlUmVmO1xuZXhwb3J0cy5mb3J3YXJkUmVmID0gZm9yd2FyZFJlZjtcbmV4cG9ydHMuaXNWYWxpZEVsZW1lbnQgPSBpc1ZhbGlkRWxlbWVudDtcbmV4cG9ydHMubGF6eSA9IGxhenk7XG5leHBvcnRzLm1lbW8gPSBtZW1vO1xuZXhwb3J0cy51c2VDYWxsYmFjayA9IHVzZUNhbGxiYWNrO1xuZXhwb3J0cy51c2VDb250ZXh0ID0gdXNlQ29udGV4dDtcbmV4cG9ydHMudXNlRGVidWdWYWx1ZSA9IHVzZURlYnVnVmFsdWU7XG5leHBvcnRzLnVzZUVmZmVjdCA9IHVzZUVmZmVjdDtcbmV4cG9ydHMudXNlSW1wZXJhdGl2ZUhhbmRsZSA9IHVzZUltcGVyYXRpdmVIYW5kbGU7XG5leHBvcnRzLnVzZUxheW91dEVmZmVjdCA9IHVzZUxheW91dEVmZmVjdDtcbmV4cG9ydHMudXNlTWVtbyA9IHVzZU1lbW87XG5leHBvcnRzLnVzZVJlZHVjZXIgPSB1c2VSZWR1Y2VyO1xuZXhwb3J0cy51c2VSZWYgPSB1c2VSZWY7XG5leHBvcnRzLnVzZVN0YXRlID0gdXNlU3RhdGU7XG5leHBvcnRzLnZlcnNpb24gPSBSZWFjdFZlcnNpb247XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG59O1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcGFzc2luZyBmdW5jdGlvbiBpbiBvcHRpb25zLCB0aGVuIHVzZSBpdCBmb3IgcmVzb2x2ZSBcImhlYWRcIiBlbGVtZW50LlxuICAgICAgICAgICAgICAgIC8vIFVzZWZ1bCBmb3IgU2hhZG93IFJvb3Qgc3R5bGUgaS5lXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgaW5zZXJ0SW50bzogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmb29cIikuc2hhZG93Um9vdCB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bdGFyZ2V0XVxuXHR9O1xufSkoKTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSBcImJvb2xlYW5cIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcbiAgICAgICAgaWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0aWYob3B0aW9ucy5hdHRycy50eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdH1cblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdGlmKG9wdGlvbnMuYXR0cnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHR9XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC98XFxzKiQpL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG4iLCJ2YXIgQkFTRTY0X0FSUkFZID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiLnNwbGl0KFwiXCIpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSlcbnZhciBCQVNFNjRfRU5DT0RFX1RBQkxFID0gbmV3IE1hcChCQVNFNjRfQVJSQVkubWFwKChvcmQsIGkpID0+IFtpLCBvcmRdKSlcbnZhciBCQVNFNjRfREVDT0RFX1RBQkxFID0gbmV3IE1hcChCQVNFNjRfQVJSQVkubWFwKChvcmQsIGkpID0+IFtvcmQsIGldKSlcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZShidWZmZXIpe1xuICAgIGJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcikuc2xpY2UoKVxuICAgIHZhciBvdXRwdXQgPSBuZXcgVWludDhBcnJheShNYXRoLmNlaWwoTWF0aC5jZWlsKGJ1ZmZlci5sZW5ndGggKiA0IC8gMykgLyA0KSAqIDQpXG4gICAgbGV0IGNvbnRpbnVvdXMgPSBNYXRoLmZsb29yKGJ1ZmZlci5sZW5ndGggLyAzKSAqIDNcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udGludW91czsgaSs9Myl7XG4gICAgICAgIGxldCBrID0gNCAqIGkgLyAzXG4gICAgICAgIG91dHB1dFtrXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KGJ1ZmZlcltpXSA+PiAyKVxuICAgICAgICBvdXRwdXRbaysxXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KChidWZmZXJbaV0gJiAweDAzKSA8PCA0IHwgYnVmZmVyW2krMV0gPj4gNClcbiAgICAgICAgb3V0cHV0W2srMl0gPSBCQVNFNjRfRU5DT0RFX1RBQkxFLmdldCgoYnVmZmVyW2krMV0gJiAweDBGKSA8PCAyIHwgYnVmZmVyW2krMl0gPj4gNilcbiAgICAgICAgb3V0cHV0W2srM10gPSBCQVNFNjRfRU5DT0RFX1RBQkxFLmdldChidWZmZXJbaSsyXSAmIDB4M0YpXG4gICAgfVxuXG4gICAgaWYgKGJ1ZmZlcltjb250aW51b3VzXSAhPSB1bmRlZmluZWQpe1xuICAgICAgICBsZXQgayA9IDQgKiBjb250aW51b3VzIC8gM1xuICAgICAgICBvdXRwdXRba10gPSBCQVNFNjRfRU5DT0RFX1RBQkxFLmdldChidWZmZXJbY29udGludW91c10gPj4gMilcbiAgICAgICAgaWYgKGJ1ZmZlcltjb250aW51b3VzKzFdID09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBvdXRwdXRbaysxXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KChidWZmZXJbY29udGludW91c10gJiAweDAzKSA8PCA0KSBcbiAgICAgICAgICAgIG91dHB1dFtrKzJdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoNjQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXRbaysxXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KChidWZmZXJbY29udGludW91c10gJiAweDAzKSA8PCA0IHwgYnVmZmVyW2NvbnRpbnVvdXMrMV0gPj4gNClcbiAgICAgICAgICAgIG91dHB1dFtrKzJdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoKGJ1ZmZlcltjb250aW51b3VzKzFdICYgMHgwRikgPDwgMilcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXRbayszXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KDY0KVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGUoYnVmZmVyKXtcbiAgICBidWZmZXIgPSBuZXcgVWludDhBcnJheShidWZmZXIpLnNsaWNlKClcbiAgICBidWZmZXIgPSBidWZmZXIubWFwKHYgPT4gQkFTRTY0X0RFQ09ERV9UQUJMRS5nZXQodikpXG4gICAgeyBsZXQgcCA9IGJ1ZmZlci5pbmRleE9mKDY0KTsgYnVmZmVyID0gYnVmZmVyLnN1YmFycmF5KDAsIHAgIT0gLTEgPyBwIDogYnVmZmVyLmxlbmd0aCl9XG4gICAgdmFyIG91dHB1dCA9IG5ldyBVaW50OEFycmF5KDMgKiBidWZmZXIubGVuZ3RoIC8gNCkgXG4gICAgbGV0IGNvbnRpbnVvdXMgPSBNYXRoLmZsb29yKGJ1ZmZlci5sZW5ndGggLyA0KSAqIDQgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250aW51b3VzOyBpKz00KXtcbiAgICAgICAgbGV0IGsgPSAzICogaSAvIDQgXG4gICAgICAgIG91dHB1dFtrXSA9IGJ1ZmZlcltpXSA8PCAyIHwgYnVmZmVyW2krMV0gPj4gNFxuICAgICAgICBvdXRwdXRbaysxXSA9IChidWZmZXJbaSsxXSAmIDB4MEYpIDw8IDQgfCBidWZmZXJbaSsyXSA+PiAyXG4gICAgICAgIG91dHB1dFtrKzJdID0gKGJ1ZmZlcltpKzJdICYgMHgwMykgPDwgNiB8IGJ1ZmZlcltpKzNdIFxuICAgIH1cbiAgICBpZiAoYnVmZmVyW2NvbnRpbnVvdXNdICE9IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCBrID0gMyAqIGNvbnRpbnVvdXMgLyA0IFxuICAgICAgICBvdXRwdXRba10gPSBidWZmZXJbY29udGludW91c10gPDwgMiB8IGJ1ZmZlcltjb250aW51b3VzKzFdID4+IDRcbiAgICAgICAgaWYgKGJ1ZmZlcltjb250aW51b3VzKzJdICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBvdXRwdXRbaysxXSA9IChidWZmZXJbY29udGludW91cysxXSAmIDB4MEYpIDw8IDQgfCBidWZmZXJbY29udGludW91cysyXSA+PiAyXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dFxufSIsImltcG9ydCB7IE1vZGVPZk9wZXJhdGlvbiBhcyBhZXMgfSBmcm9tICdhZXMtanMnXG5pbXBvcnQgKiBhcyBiYXNlNjQgZnJvbSBcIi4vYmFzZTY0LmpzXCJcblxuY29uc3QgY1NoYXJwSGVhZGVyID0gWzAsIDEsIDAsIDAsIDAsIDI1NSwgMjU1LCAyNTUsIDI1NSwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNiwgMSwgMCwgMCwgMF1cbmNvbnN0IGFlc0tleSA9IFN0cmluZ1RvQnl0ZXMoJ1VLdTUyZVBVQndldFo5d05YODhvNTRkbmZLUnUwVDFsJylcbmNvbnN0IGVjYiA9IG5ldyBhZXMuZWNiKGFlc0tleSlcblxuU3RyaW5nLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gU3RyaW5nVG9CeXRlcyhzdHJpbmcpe1xuICAgIHJldHVybiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoc3RyaW5nKSBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ5dGVzVG9TdHJpbmcoYnl0ZXMpe1xuICAgIHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoYnl0ZXMpXG59XG5cbi8vIGFlcyBkZWNyeXB0cyBhbmQgcmVtb3ZlcyBwa2NzNyBwYWRkaW5nIFxuZXhwb3J0IGZ1bmN0aW9uIEFFU0RlY3J5cHQoYnl0ZXMpe1xuICAgIGxldCBkYXRhID0gZWNiLmRlY3J5cHQoYnl0ZXMpXG4gICAgZGF0YSA9IGRhdGEuc3ViYXJyYXkoMCwgLWRhdGFbZGF0YS5sZW5ndGgtMV0pIFxuICAgIHJldHVybiBkYXRhXG59XG5cbi8vIHBrY3M3IHBhZHMgYW5kIGVuY3J5cHRzIFxuZXhwb3J0IGZ1bmN0aW9uIEFFU0VuY3J5cHQoYnl0ZXMpe1xuICAgIGxldCBwYWRWYWx1ZSA9IDE2IC0gYnl0ZXMubGVuZ3RoICUgMTZcbiAgICB2YXIgcGFkZGVkID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoICsgcGFkVmFsdWUpXG4gICAgcGFkZGVkLmZpbGwocGFkVmFsdWUpXG4gICAgcGFkZGVkLnNldChieXRlcylcbiAgICByZXR1cm4gZWNiLmVuY3J5cHQocGFkZGVkKVxufVxuXG4vLyBMZW5ndGhQcmVmaXhlZFN0cmluZyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2NjMjM2ODQ0LmFzcHhcbmV4cG9ydCBmdW5jdGlvbiBHZW5lcmF0ZUxlbmd0aFByZWZpeGVkU3RyaW5nKGxlbmd0aCl7XG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKDB4N0ZGRkZGRkYsIGxlbmd0aCkgLy8gbWF4aW11bSB2YWx1ZVxuICAgIHZhciBieXRlcyA9IFtdIFxuICAgIGZvciAobGV0IGk9MDsgaTw0OyBpKyspe1xuICAgICAgICBpZiAobGVuZ3RoID4+IDcgIT0gMCl7XG4gICAgICAgICAgICBieXRlcy5wdXNoKGxlbmd0aCAmIDB4N0YgfCAweDgwKVxuICAgICAgICAgICAgbGVuZ3RoID4+PSA3IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnl0ZXMucHVzaChsZW5ndGggJiAweDdGKVxuICAgICAgICAgICAgbGVuZ3RoID4+PSA3XG4gICAgICAgICAgICBicmVhayBcbiAgICAgICAgfVxuICAgIH0gXG4gICAgaWYgKGxlbmd0aCAhPSAwKXtcbiAgICAgICAgYnl0ZXMucHVzaChsZW5ndGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGJ5dGVzIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gQWRkSGVhZGVyKGJ5dGVzKXtcbiAgICB2YXIgbGVuZ3RoRGF0YSA9IEdlbmVyYXRlTGVuZ3RoUHJlZml4ZWRTdHJpbmcoYnl0ZXMubGVuZ3RoKVxuICAgIHZhciBuZXdCeXRlcyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzLmxlbmd0aCArIGNTaGFycEhlYWRlci5sZW5ndGggKyBsZW5ndGhEYXRhLmxlbmd0aCArIDEpXG4gICAgbmV3Qnl0ZXMuc2V0KGNTaGFycEhlYWRlcikgLy8gZml4ZWQgaGVhZGVyIFxuICAgIG5ld0J5dGVzLnN1YmFycmF5KGNTaGFycEhlYWRlci5sZW5ndGgpLnNldChsZW5ndGhEYXRhKSAvLyB2YXJpYWJsZSBMZW5ndGhQcmVmaXhlZFN0cmluZyBoZWFkZXIgXG4gICAgbmV3Qnl0ZXMuc3ViYXJyYXkoY1NoYXJwSGVhZGVyLmxlbmd0aCArIGxlbmd0aERhdGEubGVuZ3RoKS5zZXQoYnl0ZXMpIC8vIG91ciBkYXRhIFxuICAgIG5ld0J5dGVzLnN1YmFycmF5KGNTaGFycEhlYWRlci5sZW5ndGggKyBsZW5ndGhEYXRhLmxlbmd0aCArIGJ5dGVzLmxlbmd0aCkuc2V0KFsxMV0pIC8vIGZpeGVkIGhlYWRlciAoMTEpIFxuICAgIHJldHVybiBuZXdCeXRlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVtb3ZlSGVhZGVyKGJ5dGVzKXtcbiAgICAvLyByZW1vdmUgZml4ZWQgY3NoYXJwIGhlYWRlciwgcGx1cyB0aGUgZW5kaW5nIGJ5dGUgMTEuIFxuICAgIGJ5dGVzID0gYnl0ZXMuc3ViYXJyYXkoY1NoYXJwSGVhZGVyLmxlbmd0aCwgYnl0ZXMubGVuZ3RoIC0gMSkgXG4gXG4gICAgXG4gICAgLy8gcmVtb3ZlIExlbmd0aFByZWZpeGVkU3RyaW5nIGhlYWRlciBcbiAgICBsZXQgbGVuZ3RoQ291bnQgPSAwIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgICAgICAgbGVuZ3RoQ291bnQrK1xuICAgICAgICBpZiAoKGJ5dGVzW2ldICYgMHg4MCkgPT0gMCl7IFxuICAgICAgICAgICAgYnJlYWsgIFxuICAgICAgICB9XG4gICAgfVxuICAgIGJ5dGVzID0gYnl0ZXMuc3ViYXJyYXkobGVuZ3RoQ291bnQpXG5cbiAgICByZXR1cm4gYnl0ZXMgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEZWNvZGUoYnl0ZXMpe1xuICAgIGJ5dGVzID0gYnl0ZXMuc2xpY2UoKSBcbiAgICBieXRlcyA9IFJlbW92ZUhlYWRlcihieXRlcylcbiAgICBieXRlcyA9IGJhc2U2NC5kZWNvZGUoYnl0ZXMpXG4gICAgYnl0ZXMgPSBBRVNEZWNyeXB0KGJ5dGVzKVxuICAgIHJldHVybiBCeXRlc1RvU3RyaW5nKGJ5dGVzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gRW5jb2RlKGpzb25TdHJpbmcpe1xuICAgIHZhciBieXRlcyA9IFN0cmluZ1RvQnl0ZXMoanNvblN0cmluZylcbiAgICBieXRlcyA9IEFFU0VuY3J5cHQoYnl0ZXMpXG4gICAgYnl0ZXMgPSBiYXNlNjQuZW5jb2RlKGJ5dGVzKVxuICAgIC8vIGJ5dGVzID0gYnl0ZXMuZmlsdGVyKHYgPT4gdiAhPSAxMCAmJiB2ICE9IDEzKVxuICAgIHJldHVybiBBZGRIZWFkZXIoYnl0ZXMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIYXNoKHN0cmluZyl7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdChcIlwiKS5yZWR1Y2UoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuICgoYSA8PCA1KSAtIGEpICsgYi5jaGFyQ29kZUF0KDApICAgXG4gICAgfSwgMClcbn1cblxuZnVuY3Rpb24gcm91bmQodmFsdWUsIHByZWNpc2lvbil7XG4gICAgbGV0IG11bHRpID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbilcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIG11bHRpKSAvIG11bHRpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIdW1hblRpbWUoZGF0ZSl7XG4gICAgdmFyIG1pbnV0ZXMgPSAobmV3IERhdGUoKSAtIGRhdGUpIC8gMTAwMCAvIDYwXG4gICAgdmFyIGhvdXJzID0gbWludXRlcyAvIDYwICBcbiAgICB2YXIgZGF5cyA9IGhvdXJzIC8gMjRcbiAgICB2YXIgd2Vla3MgPSBkYXlzIC8gN1xuICAgIHZhciBtb250aHMgPSB3ZWVrcyAvIDQgXG4gICAgdmFyIHllYXJzID0gbW9udGhzIC8gMTIgXG5cbiAgICBpZiAobWludXRlcyA8IDEpe1xuICAgICAgICByZXR1cm4gXCJub3dcIlxuICAgIH0gZWxzZSBpZiAobWludXRlcyA8IDEyMCl7XG4gICAgICAgIHJldHVybiBgYWJvdXQgJHtyb3VuZChtaW51dGVzLCAwKX0gbWludXRlcyBhZ29gXG4gICAgfSBlbHNlIGlmIChob3VycyA8IDQ4KXtcbiAgICAgICAgcmV0dXJuIGBhYm91dCAke3JvdW5kKGhvdXJzLCAwKX0gaG91cnMgYWdvYFxuICAgIH0gZWxzZSBpZiAoZGF5cyA8IDE0KXtcbiAgICAgICAgcmV0dXJuIGBhYm91dCAke3JvdW5kKGRheXMsIDApfSBkYXlzIGFnb2BcbiAgICB9IGVsc2UgaWYgKHdlZWtzIDwgOCl7XG4gICAgICAgIHJldHVybiBgYWJvdXQgJHtyb3VuZCh3ZWVrcywgMCl9IHdlZWtzIGFnb2BcbiAgICB9IGVsc2UgaWYgKG1vbnRocyA8IDI0KXtcbiAgICAgICAgcmV0dXJuIGBhYm91dCAke3JvdW5kKG1vbnRocywgMSl9IG1vbnRocyBhZ29gXG4gICAgfSBcblxuICAgIHJldHVybiBgYWJvdXQgJHtyb3VuZCh5ZWFycywgMSl9IHllYXJzIGFnb2Bcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERvd25sb2FkRGF0YShkYXRhLCBmaWxlTmFtZSl7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICAgIGEuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbZGF0YV0sIHt0eXBlOiBcIm9jdGV0L3N0cmVhbVwifSkpKTtcbiAgICBhLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlTmFtZSlcbiAgICBhLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgcG9zaXRpb246IGZpeGVkOyBvcGFjaXR5OiAwOyBsZWZ0OiAwOyB0b3A6IDA7YClcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZChhKVxuICAgIGEuY2xpY2soKVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSlcbn1cbiIsImltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiXG5pbXBvcnQgeyBFbmNvZGUsIERlY29kZSwgRG93bmxvYWREYXRhIH0gZnJvbSBcIi4vZnVuY3Rpb25zLmpzXCJcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCJcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLmZpbGVJbnB1dFJlZiA9IFJlYWN0LmNyZWF0ZVJlZigpXG4gICAgfVxuXG4gICAgc3RhdGUgPSB7XG4gICAgICAgIHNhdmVEYXRhOiBudWxsLCAvLyBUaGlzIHdpbGwgaG9sZCB0aGUgcGFyc2VkIEpTT04gb2JqZWN0XG4gICAgICAgIGZpbGVOYW1lOiBcIlwiLFxuICAgICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsXG4gICAgfVxuICAgIFxuICAgIC8vIC0tLSBEcmFnIGFuZCBEcm9wIEhhbmRsZXJzIC0tLVxuICAgIGhhbmRsZURyYWdFbnRlciA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRyYWdnaW5nOiB0cnVlIH0pO1xuICAgIH07XG4gICAgaGFuZGxlRHJhZ0xlYXZlID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZHJhZ2dpbmc6IGZhbHNlIH0pO1xuICAgIH07XG4gICAgaGFuZGxlRHJhZ092ZXIgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfTtcbiAgICBoYW5kbGVEcm9wID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZHJhZ2dpbmc6IGZhbHNlIH0pO1xuICAgICAgICBjb25zdCBmaWxlcyA9IFsuLi5lLmRhdGFUcmFuc2Zlci5maWxlc107XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZShmaWxlc1swXSk7XG4gICAgfTtcblxuICAgIC8vIC0tLSBGaWxlIEhhbmRsaW5nIC0tLVxuICAgIGhhbmRsZUJyb3dzZUNsaWNrID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmZpbGVJbnB1dFJlZi5jdXJyZW50LmNsaWNrKCk7XG4gICAgfTtcblxuICAgIGhhbmRsZUZpbGVTZWxlY3QgPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZShmaWxlKTtcbiAgICAgICAgZS50YXJnZXQudmFsdWUgPSBudWxsOyAvLyBSZXNldCBpbnB1dCBmb3IgcmUtdXBsb2FkaW5nIHRoZSBzYW1lIGZpbGVcbiAgICB9XG5cbiAgICBoYW5kbGVGaWxlID0gKGZpbGUpID0+IHtcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG5cbiAgICAgICAgLy8gVmFsaWRhdGlvbjogQ2hlY2sgZm9yIC5kYXQgZXh0ZW5zaW9uXG4gICAgICAgIGlmICghZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJy5kYXQnKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBcIkludmFsaWQgZmlsZSB0eXBlLiBQbGVhc2UgdXBsb2FkIGEgLmRhdCBmaWxlLlwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGZpbGUpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWFkZXIucmVzdWx0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY3J5cHRlZCA9IERlY29kZShuZXcgVWludDhBcnJheShyZXN1bHQpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVEYXRhOiBwYXJzZWREYXRhLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkRlY3J5cHRpb24gZmFpbGVkOlwiLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogXCJGaWxlIGRlY3J5cHRpb24gZmFpbGVkLiBUaGUgZmlsZSBtYXkgYmUgY29ycnVwdCBvciBub3QgYSB2YWxpZCBTaWxrc29uZyBzYXZlLlwiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIC0tLSBFZGl0b3IgRmllbGQgSGFuZGxlcnMgLS0tXG4gICAgLy8gQSBnZW5lcmljIGhhbmRsZXIgZm9yIG5lc3RlZCBudW1lcmljIHZhbHVlcy5cbiAgICBoYW5kbGVOdW1lcmljQ2hhbmdlID0gKGUsIC4uLmtleXMpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChlLnRhcmdldC52YWx1ZSwgMTApIHx8IDA7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwcmV2U3RhdGUpKTsgLy8gRGVlcCBjb3B5XG4gICAgICAgICAgICBsZXQgY3VycmVudCA9IG5ld1N0YXRlLnNhdmVEYXRhO1xuICAgICAgICAgICAgLy8gVHJhdmVyc2UgdGhlIGtleXMgdG8gZ2V0IHRvIHRoZSBwYXJlbnQgb2JqZWN0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnRba2V5c1tpXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGZpbmFsIGtleVxuICAgICAgICAgICAgY3VycmVudFtrZXlzW2tleXMubGVuZ3RoIC0gMV1dID0gdmFsdWU7XG5cbiAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZXMgZm9yIGxpbmtlZCB2YWx1ZXNcbiAgICAgICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKCdoZWFsdGgnKSkge1xuICAgICAgICAgICAgICAgIG5ld1N0YXRlLnNhdmVEYXRhLnBsYXllckRhdGEubWF4SGVhbHRoID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcygnc2lsaycpKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhdGUuc2F2ZURhdGEucGxheWVyRGF0YS5zaWxrTWF4ID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQSBnZW5lcmljIGhhbmRsZXIgZm9yIG5lc3RlZCBib29sZWFuIHZhbHVlcyAoY2hlY2tib3hlcykuXG4gICAgaGFuZGxlQ2hlY2tib3hDaGFuZ2UgPSAoZSwgLi4ua2V5cykgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwcmV2U3RhdGUpKTsgLy8gRGVlcCBjb3B5XG4gICAgICAgICAgICBsZXQgY3VycmVudCA9IG5ld1N0YXRlLnNhdmVEYXRhO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50W2tleXNbaV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudFtrZXlzW2tleXMubGVuZ3RoIC0gMV1dID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLSBTYXZlIEhhbmRsZXJzIC0tLVxuICAgIGhhbmRsZVNhdmVFbmNyeXB0ZWQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5zYXZlRGF0YSkgcmV0dXJuO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUuc2F2ZURhdGEpO1xuICAgICAgICAgICAgY29uc3QgZW5jcnlwdGVkID0gRW5jb2RlKGpzb25TdHJpbmcpO1xuICAgICAgICAgICAgRG93bmxvYWREYXRhKGVuY3J5cHRlZCwgdGhpcy5zdGF0ZS5maWxlTmFtZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVuY3J5cHRpb24vU2F2ZSBmYWlsZWQ6XCIsIGVycik7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgdGhlIGZpbGUuXCIgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVTYXZlSnNvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNhdmVEYXRhKSByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5zYXZlRGF0YSwgbnVsbCwgMik7XG4gICAgICAgICAgICBjb25zdCBuZXdGaWxlTmFtZSA9IHRoaXMuc3RhdGUuZmlsZU5hbWUucmVwbGFjZSgnLmRhdCcsICcuanNvbicpO1xuICAgICAgICAgICAgRG93bmxvYWREYXRhKGpzb25TdHJpbmcsIG5ld0ZpbGVOYW1lKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSlNPTiBzYXZlIGZhaWxlZDpcIiwgZXJyKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogXCJGYWlsZWQgdG8gc2F2ZSB0aGUgSlNPTiBmaWxlLlwiIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IHNhdmVEYXRhLCBkcmFnZ2luZywgZXJyb3IgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHBkID0gc2F2ZURhdGEgPyBzYXZlRGF0YS5wbGF5ZXJEYXRhIDogbnVsbDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD1cIndyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICA8aDE+U2lsa3NvbmcgU2F2ZSBFZGl0b3I8L2gxPlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnN0cnVjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPlNhdmUgRmlsZSBMb2NhdGlvbnM8L2gyPlxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwic2F2ZS1sb2NhdGlvbnMtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TeXN0ZW08L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TG9jYXRpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+V2luZG93czwvdGQ+PHRkPjxjb2RlPiVVU0VSUFJPRklMRSVcXEFwcERhdGFcXExvY2FsTG93XFxUZWFtIENoZXJyeVxcSG9sbG93IEtuaWdodCBTaWxrc29uZ1xcPC9jb2RlPjwvdGQ+PC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+PHRkPk1pY3Jvc29mdCBTdG9yZTwvdGQ+PHRkPjxjb2RlPiVMT0NBTEFQUERBVEElXFxQYWNrYWdlc1xcVGVhbUNoZXJyeS5Ib2xsb3dLbmlnaHRTaWxrc29uZ195NGp2enRwZ2NjajQyXFxTeXN0ZW1BcHBEYXRhXFx3Z3M8L2NvZGU+PC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+bWFjT1MgKE9TIFgpPC90ZD48dGQ+PGNvZGU+JEhPTUUvTGlicmFyeS9BcHBsaWNhdGlvbiBTdXBwb3J0L3VuaXR5LlRlYW0tQ2hlcnJ5LlNpbGtzb25nL2RlZmF1bHQ8L2NvZGU+PC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj48dGQ+TGludXg8L3RkPjx0ZD48Y29kZT4kWERHX0NPTkZJR19IT01FL3VuaXR5M2QvVGVhbSBDaGVycnkvSG9sbG93IEtuaWdodCBTaWxrc29uZy88L2NvZGU+PC90ZD48L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibm90ZXNcIj5Gb3IgU3RlYW0sIGVhY2ggdXNlcuKAmXMgc2F2ZSBmaWxlcyB3aWxsIGJlIGluIGEgc3ViLWZvbGRlciBvZiB0aGVpciBTdGVhbSB1c2VyIElELiBGb3Igbm9uLVN0ZWFtIGJ1aWxkcywgc2F2ZSBmaWxlcyB3aWxsIGJlIGluIGEgZGVmYXVsdCBzdWItZm9sZGVyLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibm90ZXNcIj48Y29kZT51c2VyMS5kYXQ8L2NvZGU+IGZvciBzYXZlIHNsb3QgMS4gPGNvZGU+dXNlcjIuZGF0PC9jb2RlPiBmb3Igc2xvdCAyLiA0IHRvdGFsIHNhdmUgc2xvdHMuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXJuaW5nXCI+QWx3YXlzIGJhY2t1cCB5b3VyIHNhdmUgZmlsZXMgKC5kYXQpIGJlZm9yZSBlZGl0aW5nITwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Bkcm9wLXpvbmUgJHtkcmFnZ2luZyA/ICdkcmFnZ2luZycgOiAnJ31gfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUJyb3dzZUNsaWNrfVxuICAgICAgICAgICAgICAgICAgICBvbkRyYWdFbnRlcj17dGhpcy5oYW5kbGVEcmFnRW50ZXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uRHJhZ0xlYXZlPXt0aGlzLmhhbmRsZURyYWdMZWF2ZX1cbiAgICAgICAgICAgICAgICAgICAgb25EcmFnT3Zlcj17dGhpcy5oYW5kbGVEcmFnT3Zlcn1cbiAgICAgICAgICAgICAgICAgICAgb25Ecm9wPXt0aGlzLmhhbmRsZURyb3B9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cD5EcmFnIC5kYXQgZmlsZXMgaGVyZSBvcjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tc2Vjb25kYXJ5XCI+QnJvd3NlIEZpbGVzPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIHtlcnJvciAmJiA8cCBjbGFzc05hbWU9XCJlcnJvci1tZXNzYWdlXCI+e2Vycm9yfTwvcD59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJmaWxlLWlucHV0XCIgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCIuZGF0XCIgcmVmPXt0aGlzLmZpbGVJbnB1dFJlZn0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlRmlsZVNlbGVjdH0gLz5cblxuICAgICAgICAgICAgICAgIDxociAvPlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYXZlLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tc2Vjb25kYXJ5XCIgb25DbGljaz17dGhpcy5oYW5kbGVTYXZlSnNvbn0gZGlzYWJsZWQ9eyFzYXZlRGF0YX0+U2F2ZSAuanNvbjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1wcmltYXJ5XCIgb25DbGljaz17dGhpcy5oYW5kbGVTYXZlRW5jcnlwdGVkfSBkaXNhYmxlZD17IXNhdmVEYXRhfT5TYXZlIEVuY3J5cHRlZCAuZGF0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAge3NhdmVEYXRhICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlZGl0b3ItY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVkaXRvci1zZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPkJhc2ljIFN0YXRzPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiaGVhbHRoXCI+SGVhbHRoPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImhlYWx0aFwiIHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17cGQuaGVhbHRofSBvbkNoYW5nZT17KGUpID0+IHRoaXMuaGFuZGxlTnVtZXJpY0NoYW5nZShlLCAncGxheWVyRGF0YScsICdoZWFsdGgnKX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5vdGVcIj5PdmVyIDExIG1hc2tzIGNhbiBicmVhayB0aGUgVUkuPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInNpbGtcIj5TaWxrPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cInNpbGtcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e3BkLnNpbGt9IG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5oYW5kbGVOdW1lcmljQ2hhbmdlKGUsICdwbGF5ZXJEYXRhJywgJ3NpbGsnKX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5vdGVcIj5NYXggMTcuPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInJvc2FyaWVzXCI+Um9zYXJpZXM8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwicm9zYXJpZXNcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e3BkLmdlb30gb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmhhbmRsZU51bWVyaWNDaGFuZ2UoZSwgJ3BsYXllckRhdGEnLCAnZ2VvJyl9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWRpdG9yLXNlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+VXBncmFkZXMgPHNwYW4gY2xhc3NOYW1lPVwibm90ZVwiPihXYXJuaW5nOiBTcG9pbGVycyk8L3NwYW4+PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYWlsVXBncmFkZXNcIj5OZWVkbGUgVXBncmFkZXM8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwibmFpbFVwZ3JhZGVzXCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPXtwZC5uYWlsVXBncmFkZXN9IG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5oYW5kbGVOdW1lcmljQ2hhbmdlKGUsICdwbGF5ZXJEYXRhJywgJ25haWxVcGdyYWRlcycpfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibm90ZVwiPlZhbHVlIGZyb20gMCB0byA0Ljwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiaGFzTmVlZGxlVGhyb3dcIj5IYXMgTmVlZGxlIFRocm93PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImhhc05lZWRsZVRocm93XCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17cGQuaGFzTmVlZGxlVGhyb3d9IG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5oYW5kbGVDaGVja2JveENoYW5nZShlLCAncGxheWVyRGF0YScsICdoYXNOZWVkbGVUaHJvdycpfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVkaXRvci1zZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPk1hcDwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibm90ZVwiPk1hcCBlZGl0aW5nIGZlYXR1cmVzIGFyZSBjb21pbmcgc29vbi48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlZGl0b3Itc2VjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMj5FbmVtaWVzIFNlZW48L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm5vdGVcIj5CZXN0aWFyeSBlZGl0aW5nIGZlYXR1cmVzIGFyZSBjb21pbmcgc29vbi48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5SZWFjdERPTS5yZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyb290XCIpKTtcbiIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufSJdLCJzb3VyY2VSb290IjoiIn0=