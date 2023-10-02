var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/cowsayjs/lib/box.js
var require_box = __commonJS({
  "node_modules/cowsayjs/lib/box.js"(exports, module) {
    "use strict";
    var limits = {
      say: [
        "< ",
        " >",
        "/ ",
        " \\",
        "\\ ",
        " /",
        "| ",
        " |"
      ],
      think: [
        "( ",
        " )",
        "( ",
        " )",
        "( ",
        " )",
        "( ",
        " )"
      ]
    };
    function split(message, wrap) {
      if (typeof wrap !== "number" || isNaN(wrap)) {
        return message.split(/\r\n|[\n\r\f\v\u2028\u2029\u0085]/g).map(function(line) {
          var tab = line.indexOf("	");
          if (tab === -1) {
            return line;
          }
          var tabbed = line;
          do {
            var spaces = Array(9 - tab % 8).join(" ");
            tabbed = tabbed.slice(0, tab) + spaces + tabbed.slice(tab + 1);
            tab = tabbed.indexOf("	", tab + spaces.length);
          } while (tab !== -1);
          return tabbed;
        });
      }
      var lines = message.replace(/(?:\r\n|[\n\r\f\v\u2028\u2029\u0085])(\S)/g, " $1").replace(/(?:\r\n|[\n\r\f\v\u2028\u2029\u0085])\s+/g, "\n\n").replace(/(?:\r\n|[\t\n\r\f\v\u2028\u2029\u0085])$/g, " ").split(/\r\n|[\n\r\f\v\u2028\u2029\u0085]/g);
      lines = lines.map(function(line, i) {
        if (/^\s*$/.test(line)) {
          return "";
        }
        var fixed = line.replace(/\s+/g, " ");
        return i > 0 ? fixed.replace(/^\s+/, "") : fixed;
      }).filter(function(line, i, lines2) {
        if (line.length > 0 || i <= 1) {
          return true;
        }
        return lines2[i - 1].length > 0;
      });
      if (lines.every(function(line) {
        return line.length === 0;
      })) {
        return [""];
      }
      if (lines[lines.length - 1].length === 0) {
        lines.pop();
      }
      var initial = [];
      var max = wrap;
      var col = wrap - 1;
      return lines.reduce(function(acc, line, i, src) {
        if (line.length === 0) {
          return acc.concat(line);
        }
        if (max < 2) {
          if (src[i + 1] !== "") {
            src.splice(0);
          }
          max = 2;
          col = 1;
          return acc.concat("0");
        }
        var last = i > 0 ? acc[acc.length - 1] + line : line;
        var space = last.length < max ? last.length : last.lastIndexOf(" ", col);
        var br = space > 0 && space < col ? space : last.length === max && last[last.length - 1] === " " ? max : col;
        var words = acc.concat(last.slice(0, br));
        var rest = line.slice(br).replace(/^\s+/, "");
        while (rest.length > 0) {
          space = rest.length < max ? rest.length : rest.lastIndexOf(" ", col);
          br = space > 0 && space < col ? space : rest.length === max && rest[rest.length - 1] === " " ? max : col;
          words.push(rest.slice(0, br));
          rest = rest.slice(br).replace(/^\s+/, "");
        }
        return words;
      }, initial);
    }
    function pad(str, len) {
      if (str.length >= len) {
        return str;
      }
      var pad2 = Array(len - str.length + 1).join(" ");
      return str + pad2;
    }
    function perform(action, message, wrap) {
      var type = action === "think" ? "think" : "say";
      var text = typeof message === "string" ? message : "";
      var col;
      switch (typeof wrap) {
        case "number":
          col = wrap;
          break;
        case "string":
          col = parseInt(wrap);
          break;
        default:
          switch (wrap) {
            case void 0:
            case true:
              col = 40;
              break;
            default:
              col = void 0;
          }
      }
      var limit = limits[type];
      var lines = split(text, col);
      var width = lines.map(function(line) {
        return line.length;
      }).reduce(function(prev, curr) {
        return curr > prev ? curr : prev;
      }, 0);
      var spanner = Array(width + 3);
      var box = [" " + spanner.join("_")];
      if (lines.length === 1) {
        box.push(limit[0] + pad(lines[0], width) + limit[1]);
      } else {
        var last = lines.length - 1;
        var i = 0;
        do {
          switch (i) {
            case 0:
              box.push(limit[2] + pad(lines[i], width) + limit[3]);
              break;
            case last:
              box.push(limit[4] + pad(lines[i], width) + limit[5]);
              break;
            default:
              box.push(limit[6] + pad(lines[i], width) + limit[7]);
          }
        } while (++i <= last);
      }
      box.push(" " + spanner.join("-"), "");
      return box.join("\n");
    }
    function say(message, wrap) {
      return perform("say", message, wrap);
    }
    function think(message, wrap) {
      return perform("think", message, wrap);
    }
    module.exports = {
      perform,
      say,
      think
    };
  }
});

// node_modules/cowsayjs/lib/utils.js
var require_utils = __commonJS({
  "node_modules/cowsayjs/lib/utils.js"(exports, module) {
    "use strict";
    function find(arr, predicate) {
      for (var i = 0; i < arr.length; ++i) {
        var elem = arr[i];
        if (predicate(elem, i, arr)) {
          return elem;
        }
      }
      return void 0;
    }
    module.exports = {
      find
    };
  }
});

// node_modules/cowsayjs/lib/mode.js
var require_mode = __commonJS({
  "node_modules/cowsayjs/lib/mode.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var modes = [
      { id: "u", name: "default" },
      { id: "b", name: "borg", eyes: "==" },
      { id: "d", name: "dead", eyes: "xx", tongue: "U " },
      { id: "g", name: "greedy", eyes: "$$" },
      { id: "p", name: "paranoia", eyes: "@@" },
      { id: "s", name: "stoned", eyes: "**", tongue: "U " },
      { id: "t", name: "tired", eyes: "--" },
      { id: "w", name: "wired", eyes: "OO" },
      { id: "y", name: "youthful", eyes: ".." }
    ];
    var customModes = [];
    function copyModeData(modeData) {
      return {
        id: modeData.id,
        name: modeData.name,
        eyes: modeData.eyes,
        tongue: modeData.tongue
      };
    }
    function faceMode(face) {
      var mode;
      if (typeof face === "object" && face !== null) {
        mode = utils.find(modes.concat(customModes), function(mode2) {
          return mode2.eyes === face.eyes && mode2.tongue === face.tongue;
        });
      }
      if (mode === void 0) {
        mode = modes[0];
      }
      return {
        id: mode.id,
        name: mode.name
      };
    }
    function modeFace(id) {
      var face;
      if (typeof id === "string") {
        face = utils.find(modes.concat(customModes), function(mode) {
          return mode.id === id || mode.name === id;
        });
      }
      if (face === void 0) {
        face = modes[0];
      }
      return {
        eyes: face.eyes,
        tongue: face.tongue
      };
    }
    function addMode(modeData) {
      var valid = true;
      valid = valid && typeof modeData === "object" && modeData !== null && !Array.isArray(modeData);
      valid = valid && typeof modeData.id === "string" && modeData.id.length === 1;
      valid = valid && typeof modeData.name === "string" && modeData.id === modeData.name[0];
      valid = valid && (typeof modeData.eyes === "undefined" || typeof modeData.eyes === "string");
      valid = valid && (typeof modeData.tongue === "undefined" || typeof modeData.tongue === "string");
      if (!valid) {
        return false;
      }
      var ind = modes.concat(customModes).findIndex(function(mode) {
        return mode.id === modeData.id;
      });
      if (ind !== -1) {
        return false;
      }
      var options = ["h", "e", "f", "l", "n", "r", "T", "W"];
      if (options.includes(modeData.id)) {
        return false;
      }
      customModes.push(copyModeData(modeData));
      customModes.sort(function(a, b) {
        return a.id.localeCompare(b.id);
      });
      return true;
    }
    function removeMode(id) {
      if (typeof id !== "string") {
        return void 0;
      }
      var ind = customModes.findIndex(function(face) {
        return face.id === id || face.name === id;
      });
      if (ind !== -1) {
        return customModes.splice(ind, 1)[0];
      }
      return void 0;
    }
    module.exports = {
      modes: modes.map(copyModeData),
      customModes,
      faceMode,
      modeFace,
      addMode,
      removeMode
    };
  }
});

// node_modules/cowsayjs/cows/default.cow.js
var require_default_cow = __commonJS({
  "node_modules/cowsayjs/cows/default.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "default",
      template: [
        "        \\   ^__^",
        "         \\  (oo)\\_______",
        "            (__)\\       )\\/\\",
        "                ||----w |",
        "                ||     ||"
      ],
      actionPos: [
        [0, 8],
        [1, 9]
      ],
      eyesPos: [
        [1, 13],
        [1, 14]
      ],
      tonguePos: [
        [3, 13],
        [3, 14]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/apt.cow.js
var require_apt_cow = __commonJS({
  "node_modules/cowsayjs/cows/apt.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "apt",
      template: [
        "       \\ (__)",
        "         (oo)",
        "   /------\\/",
        "  / |    ||",
        " *  /\\---/\\",
        "    ~~   ~~"
      ],
      actionPos: [
        [0, 7]
      ],
      eyesPos: [
        [1, 10],
        [1, 11]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/beavis.zen.cow.js
var require_beavis_zen_cow = __commonJS({
  "node_modules/cowsayjs/cows/beavis.zen.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "beavis.zen",
      template: [
        "   \\        __------~~-,",
        "    \\     ,'            ,",
        "          /               \\",
        "         /                :",
        "        |                  '",
        "        |                  |",
        "        |                  |",
        "         |   _--           |",
        "         _| =-.     .-.   ||",
        "         o|/o/       _.   |",
        "         /  ~          \\ |",
        "       (____@)  ___~    |",
        "          |_===~~~.`    |",
        "       _______.--~     |",
        "       \\________       |",
        "                \\      |",
        "              __/-___-- -__",
        "             /            _ \\"
      ],
      actionPos: [
        [0, 3],
        [1, 4]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/blowfish.cow.js
var require_blowfish_cow = __commonJS({
  "node_modules/cowsayjs/cows/blowfish.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "blowfish",
      template: [
        "   \\",
        "    \\",
        "               |    .",
        "           .   |L  /|",
        "       _ . |\\ _| \\--+._/| .",
        "      / ||\\| Y J  )   / |/| ./",
        "     J  |)'( |        ` F`.'/",
        "   -<|  F         __     .-<",
        "     | /       .-'. `.  /-. L___",
        "     J \\      <    \\  | | O\\|.-'",
        "   _J \\  .-    \\/ O | | \\  |F",
        "  '-F  -<_.     \\   .-'  `-' L__",
        " __J  _   _.     >-'  )._.   |-'",
        " `-|.'   /_.           \\_|   F",
        "   /.-   .                _.<",
        "  /'    /.'             .'  `\\",
        "   /L  /'   |/      _.-'-\\",
        "  /'J       ___.---'\\|",
        "    |\\  .--' V  | `. `",
        "    |/`. `-.     `._)",
        "       / .-.\\",
        " VK    \\ (  `\\",
        "        `.\\",
        ""
      ],
      actionPos: [
        [0, 3],
        [1, 4]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/bong.cow.js
var require_bong_cow = __commonJS({
  "node_modules/cowsayjs/cows/bong.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "bong",
      template: [
        "         \\",
        "          \\",
        "            ^__^ ",
        "    _______/(oo)",
        "/\\/(       /(__)",
        "   | W----|| |~|",
        "   ||     || |~|  ~~",
        "             |~|  ~",
        "             |_| o",
        "             |#|/",
        "            _+#+_"
      ],
      actionPos: [
        [0, 9],
        [1, 10]
      ],
      eyesPos: [
        [3, 13],
        [3, 14]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/bud-frogs.cow.js
var require_bud_frogs_cow = __commonJS({
  "node_modules/cowsayjs/cows/bud-frogs.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "bud-frogs",
      template: [
        "     \\",
        "      \\",
        "          oO)-.                       .-(Oo",
        "         /__  _\\                     /_  __\\",
        "         \\  \\(  |     ()~()         |  )/  /",
        "          \\__|\\ |    (-___-)        | /|__/",
        "          '  '--'    ==`-'==        '--'  '"
      ],
      actionPos: [
        [0, 5],
        [1, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/bunny.cow.js
var require_bunny_cow = __commonJS({
  "node_modules/cowsayjs/cows/bunny.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "bunny",
      template: [
        "  \\",
        "   \\   \\",
        "        \\ /\\",
        "        ( )",
        "      .( o )."
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/calvin.cow.js
var require_calvin_cow = __commonJS({
  "node_modules/cowsayjs/cows/calvin.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "calvin",
      template: [
        " \\                   .,",
        "   \\         .      .TR   d'",
        "     \\      k,l    .R.b  .t .Je",
        "       \\   .P q.   a|.b .f .Z%",
        "           .b .h  .E` # J: 2`     .",
        "      .,.a .E  ,L.M'  ?:b `| ..J9!`.,",
        '       q,.h.M`   `..,   ..,""` ..2"`',
        "       .M, J8`   `:       `   3;",
        '   .    Jk              ...,   `^7"90c.',
        "    j,  ,!     .7\"'`j,.|   .n.   ...",
        "   j, 7'     .r`     4:      L   `...",
        "  ..,m.      J`    ..,|..    J`  7TWi",
        "  ..JJ,.:    %    oo      ,. ....,",
        "    .,E      3     7`g.M:    P  41",
        '   JT7"\'      O.   .J,;     ``  V"7N.',
        '   G.           ""Q+  .Zu.,!`      Z`',
        "   .9.. .         J&..J!       .  ,:",
        '      7"9a                    JM"!',
        "         .5J.     ..        ..F`",
        "            78a..   `    ..2'",
        `                J9Ksaw0"'`,
        "               .EJ?A...a.",
        "               q...g...gi",
        "              .m...qa..,y:",
        "              .HQFNB&...mm",
        "               ,Z|,m.a.,dp",
        '            .,?f` ,E?:"^7b',
        "            `A| . .F^^7'^4,",
        "             1.MMMMMMMMMMMQzna,",
        '         ...f"A.JdT     J:    Jp,',
        "          `JNa..........A....af`",
        "               `^^^^^'`"
      ],
      actionPos: [
        [0, 1],
        [1, 3],
        [2, 5],
        [3, 7]
      ],
      eyesPos: [
        [12, 18],
        [12, 19]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/cheese.cow.js
var require_cheese_cow = __commonJS({
  "node_modules/cowsayjs/cows/cheese.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "cheese",
      template: [
        "   \\",
        "    \\",
        "      _____   _________",
        "     /     \\_/         |",
        "    |                 ||",
        "    |                 ||",
        "   |    ###\\  /###   | |",
        "   |     0  \\/  0    | |",
        "  /|                 | |",
        " / |        <        |\\ \\",
        "| /|                 | | |",
        "| |     \\_______/   |  | |",
        "| |                 | / /",
        "/||                 /|||",
        "   ----------------|",
        "        | |    | |",
        "        ***    ***",
        "       /___\\  /___\\"
      ],
      actionPos: [
        [0, 3],
        [1, 4]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/cock.cow.js
var require_cock_cow = __commonJS({
  "node_modules/cowsayjs/cows/cock.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "cock",
      template: [
        "    \\",
        "     \\  /\\/\\",
        "       \\   /",
        "       |  0 >>",
        "       |___|",
        " __((_<|   |",
        "(          |",
        "(__________)",
        "   |      |",
        "   |      |",
        "   /\\     /\\"
      ],
      actionPos: [
        [0, 4],
        [1, 5]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/cower.cow.js
var require_cower_cow = __commonJS({
  "node_modules/cowsayjs/cows/cower.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "cower",
      template: [
        "     \\",
        "      \\",
        "        ,__, |    | ",
        "        (oo)\\|    |___",
        "        (__)\\|    |   )\\_",
        "             |    |_w |  \\",
        "             |    |  ||   *\n",
        "             Cower...."
      ],
      actionPos: [
        [0, 5],
        [1, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/daemon.cow.js
var require_daemon_cow = __commonJS({
  "node_modules/cowsayjs/cows/daemon.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "daemon",
      template: [
        "   \\         ,        ,",
        "    \\       /(        )`",
        "     \\      \\ \\___   / |",
        "            /- _  `-/  '",
        "           (/\\/ \\ \\   /\\",
        "           / /   | `    \\",
        "           O O   ) /    |",
        "           `-^--'`<     '",
        "          (_.)  _  )   /",
        "           `.___/`    /",
        "             `-----' /",
        "<----.     __ / __   \\",
        "<----|====O)))==) \\) /====",
        "<----'    `--' `.__,' \\",
        "             |        |",
        "              \\       /",
        "        ______( (_  / \\______",
        "      ,'  ,-----'   |        \\",
        "      `--{__________)        \\/"
      ],
      actionPos: [
        [0, 3],
        [1, 4],
        [2, 5]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/dragon-and-cow.cow.js
var require_dragon_and_cow_cow = __commonJS({
  "node_modules/cowsayjs/cows/dragon-and-cow.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "dragon-and-cow",
      template: [
        "                       \\                    ^    /^",
        "                        \\                  / \\  // \\",
        "                         \\   |\\___/|      /   \\//  .\\",
        "                          \\  /O  O  \\__  /    //  | \\ \\           *----*",
        "                            /     /  \\/_/    //   |  \\  \\          \\   |",
        "                            @___@`    \\/_   //    |   \\   \\         \\/\\ \\",
        "                           0/0/|       \\/_ //     |    \\    \\         \\  \\",
        "                       0/0/0/0/|        \\///      |     \\     \\       |  |",
        "                    0/0/0/0/0/_|_ /   (  //       |      \\     _\\     |  /",
        "                 0/0/0/0/0/0/`/,_ _ _/  ) ; -.    |    _ _\\.-~       /   /",
        "                             ,-}        _      *-.|.-~-.           .~    ~",
        "            \\     \\__/        `/\\      /                 ~-. _ .-~      /",
        "             \\____(oo)           *.   }            {                   /",
        "             (    (--)          .----~-.\\        \\-`                 .~",
        "             //__\\\\  \\__ Ack!   ///.----..<        \\             _ -~",
        "            //    \\\\               ///-._ _ _ _ _ _ _{^ - - - - ~"
      ],
      actionPos: [
        [0, 23],
        [1, 24],
        [2, 25],
        [3, 26]
      ],
      eyesPos: [
        [12, 19],
        [12, 20]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/dragon.cow.js
var require_dragon_cow = __commonJS({
  "node_modules/cowsayjs/cows/dragon.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "dragon",
      template: [
        "      \\                    / \\  //\\",
        "       \\    |\\___/|      /   \\//  \\\\",
        "            /0  0  \\__  /    //  | \\ \\    ",
        "           /     /  \\/_/    //   |  \\  \\  ",
        "           @_^_@'/   \\/_   //    |   \\   \\ ",
        "           //_^_/     \\/_ //     |    \\    \\",
        "        ( //) |        \\///      |     \\     \\",
        "      ( / /) _|_ /   )  //       |      \\     _\\",
        "    ( // /) '/,_ _ _/  ( ; -.    |    _ _\\.-~        .-~~~^-.",
        "  (( / / )) ,-{        _      `-.|.-~-.           .~         `.",
        " (( // / ))  '/\\      /                 ~-. _ .-~      .-~^-.  \\",
        " (( /// ))      `.   {            }                   /      \\  \\",
        "  (( / ))     .----~-.\\        \\-'                 .~         \\  `. \\^-.",
        "             ///.----..>        \\             _ -~             `.  ^-`  ^-_",
        "               ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~",
        "                                                                  /.-~"
      ],
      actionPos: [
        [0, 6],
        [1, 7]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/duck.cow.js
var require_duck_cow = __commonJS({
  "node_modules/cowsayjs/cows/duck.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "duck",
      template: [
        " \\",
        "  \\",
        "   \\ >()_",
        "      (__)__ _"
      ],
      actionPos: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/elephant-in-snake.cow.js
var require_elephant_in_snake_cow = __commonJS({
  "node_modules/cowsayjs/cows/elephant-in-snake.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "elephant-in-snake",
      template: [
        "       \\",
        "        \\  ....",
        "          .    ........",
        "          .            .",
        "          .             .",
        "    .......              .........",
        "    ..............................",
        "Elephant inside ASCII snake"
      ],
      actionPos: [
        [0, 7],
        [1, 8]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/elephant.cow.js
var require_elephant_cow = __commonJS({
  "node_modules/cowsayjs/cows/elephant.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "elephant",
      template: [
        " \\     /\\  ___  /\\",
        "  \\   // \\/   \\/ \\\\",
        "     ((    O O    ))",
        "      \\\\ /     \\ //",
        "       \\/  | |  \\/ ",
        "        |  | |  |",
        "        |  | |  |",
        "        |   o   |",
        "        | |   | |",
        "        |m|   |m|"
      ],
      actionPos: [
        [0, 1],
        [1, 2]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/eyes.cow.js
var require_eyes_cow = __commonJS({
  "node_modules/cowsayjs/cows/eyes.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "eyes",
      template: [
        "    \\",
        "     \\",
        "                                   .::!!!!!!!:.",
        "  .!!!!!:.                        .:!!!!!!!!!!!!",
        "  ~~~~!!!!!!.                 .:!!!!!!!!!UWWW$$$",
        "      :$$NWX!!:           .:!!!!!!XUWW$$$$$$$$$P",
        '      $$$$$##WX!:      .<!!!!UW$$$$"  $$$$$$$$#',
        "      $$$$$  $$$UX   :!!UW$$$$$$$$$   4$$$$$*",
        '      ^$$$B  $$$$\\     $$$$$$$$$$$$   d$$R"',
        `        "*$bd$$$$      '*$$$$$$$$$$$o+#"`,
        '             """"          """""""'
      ],
      actionPos: [
        [0, 4],
        [1, 5]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/flaming-sheep.cow.js
var require_flaming_sheep_cow = __commonJS({
  "node_modules/cowsayjs/cows/flaming-sheep.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "flaming-sheep",
      template: [
        "  \\            .    .     .   ",
        "   \\      .  . .     `  ,     ",
        "    \\    .; .  : .' :  :  : . ",
        "     \\   i..`: i` i.i.,i  i . ",
        "      \\   `,--.|i |i|ii|ii|i: ",
        "           UooU\\.'@@@@@@`.||' ",
        "           \\__/(@@@@@@@@@@)'  ",
        "                (@@@@@@@@)    ",
        "                `YY~~~~YY'    ",
        "                 ||    ||     "
      ],
      actionPos: [
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 6]
      ],
      eyesPos: [
        [5, 12],
        [5, 13]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/fox.cow.js
var require_fox_cow = __commonJS({
  "node_modules/cowsayjs/cows/fox.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "fox",
      template: [
        "         \\     ,-.      .-,",
        "          \\    |-.\\ __ /.-|",
        "           \\   \\  `    `  /",
        "                /_     _ \\",
        "              <  _`q  p _  >",
        "              <.._=/  \\=_. >",
        "                 {`\\()/`}`\\",
        "                 {      }  \\",
        "                 |{    }    \\",
        "                 \\ '--'   .- \\",
        "                 |-      /    \\",
        "                 | | | | |     ;",
        "                 | | |.;.,..__ |",
        '               .-"";`         `|',
        "              /    |           /",
        "              `-../____,..---'`"
      ],
      actionPos: [
        [0, 9],
        [1, 10],
        [2, 11]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/ghostbusters.cow.js
var require_ghostbusters_cow = __commonJS({
  "node_modules/cowsayjs/cows/ghostbusters.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "ghostbusters",
      template: [
        "          \\",
        "           \\",
        "            \\          __---__",
        "                    _-       /--______",
        "               __--( /     \\ )XXXXXXXXXXX\\v.",
        "             .-XXX(   O   O  )XXXXXXXXXXXXXXX-",
        "            /XXX(       U     )        XXXXXXX\\",
        "          /XXXXX(              )--_  XXXXXXXXXXX\\",
        "         /XXXXX/ (      O     )   XXXXXX   \\XXXXX\\",
        "         XXXXX/   /            XXXXXX   \\__ \\XXXXX",
        "         XXXXXX__/          XXXXXX         \\__---->",
        " ---___  XXX__/          XXXXXX      \\__         /",
        "   \\-  --__/   ___/\\  XXXXXX            /  ___--/=",
        "    \\-\\    ___/    XXXXXX              '--- XXXXXX",
        "       \\-\\/XXX\\ XXXXXX                      /XXXXX",
        "         \\XXXXXXXXX   \\                    /XXXXX/",
        "          \\XXXXXX      >                 _/XXXXX/",
        "            \\XXXXX--__/              __-- XXXX/",
        "             -XXXXXXXX---------------  XXXXXX-",
        "                \\XXXXXXXXXXXXXXXXXXXXXXXXXX/",
        '                  ""VXXXXXXXXXXXXXXXXXXV""'
      ],
      actionPos: [
        [0, 10],
        [1, 11],
        [2, 12]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/gnu.cow.js
var require_gnu_cow = __commonJS({
  "node_modules/cowsayjs/cows/gnu.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "gnu",
      template: [
        "    \\               ,-----._",
        "  .  \\         .  ,'        `-.__,------._",
        " //   \\      __\\\\'                        `-.",
        "((    _____-'___))                           |",
        " `:='/     (alf_/                            |",
        " `.=|      |='                               |",
        "    |)   O |                                  \\",
        "    |      |                               /\\  \\",
        "    |     /                          .    /  \\  \\",
        "    |    .-..__            ___   .--' \\  |\\   \\  |",
        "   |o o  |     ``--.___.  /   `-'      \\  \\\\   \\ |",
        "    `--''        '  .' / /             |  | |   | \\",
        "                 |  | / /              |  | |   mmm",
        "                 |  ||  |              | /| |",
        "                 ( .' \\ \\              || | |",
        "                 | |   \\ \\            // / /",
        "                 | |    \\ \\          || |_|",
        "                /  |    |_/         /_|",
        "               /__/"
      ],
      actionPos: [
        [0, 4],
        [1, 5],
        [2, 6]
      ],
      tonguePos: [
        [12, 5],
        [12, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/head-in.cow.js
var require_head_in_cow = __commonJS({
  "node_modules/cowsayjs/cows/head-in.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "head-in",
      template: [
        "    \\",
        "     \\",
        "    ^__^         /",
        "    (oo)\\_______/  _________",
        "    (__)\\       )=(  ____|_ \\_____",
        "        ||----w |  \\ \\     \\_____ |",
        "        ||     ||   ||           ||"
      ],
      actionPos: [
        [0, 4],
        [1, 5]
      ],
      eyesPos: [
        [3, 5],
        [3, 6]
      ],
      tonguePos: [
        [5, 5],
        [5, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/hellokitty.cow.js
var require_hellokitty_cow = __commonJS({
  "node_modules/cowsayjs/cows/hellokitty.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "hellokitty",
      template: [
        "  \\",
        "   \\",
        "      /\\_)o<",
        "     |      \\",
        "     | O . O|",
        "      \\_____/"
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/kangaroo.cow.js
var require_kangaroo_cow = __commonJS({
  "node_modules/cowsayjs/cows/kangaroo.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "kangaroo",
      template: [
        "  \\       .",
        "   \\      l\\ /\\",
        "    \\     !)Y.))",
        "         _\\| //",
        "       ,/oo  \\",
        "    .-+    _ /",
        "   `-_--=-'/",
        "         / /",
        "        /  \\_",
        "       Y  .  )",
        ` .--v--^--' /"\\`,
        ` \\/~\\/~T"--' _ \\`,
        '       !  ./~ " \\',
        "       `\\.Y      Y    _",
        "       (~~|      |   |^Y",
        "       `\\. \\     |   l |",
        "         T~\\^. Y |   / |",
        "         | |\\| | !  l  |",
        "         ! | Y | `\\/'. |",
        '   ______L_j l j   ~"  l',
        ' _/,_/, __ ~"__ }____,/',
        "~~~~~~~~~~~~~~~~~~~~~~~~~~~"
      ],
      actionPos: [
        [0, 2],
        [1, 3],
        [2, 4]
      ],
      eyesPos: [
        [4, 9],
        [4, 10]
      ],
      tonguePos: [
        [7, 5],
        [7, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/kiss.cow.js
var require_kiss_cow = __commonJS({
  "node_modules/cowsayjs/cows/kiss.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "kiss",
      template: [
        "     \\",
        "      \\",
        "             ,;;;;;;;,",
        "            ;;;;;;;;;;;,",
        "           ;;;;;'_____;'",
        "           ;;;(/))))|((\\",
        "           _;;((((((|))))",
        "          / |_\\\\\\\\\\\\\\\\\\\\\\\\",
        "     .--~(  \\ ~))))))))))))",
        "    /     \\  `\\-(((((((((((\\\\",
        "    |    | `\\   ) |\\       /|)",
        "     |    |  `. _/  \\_____/ |",
        "      |    , `\\~            /",
        "       |    \\  \\           /",
        "      | `.   `\\|          /",
        "      |   ~-   `\\        /",
        "       \\____~._/~ -_,   (\\",
        "        |-----|\\   \\    ';;",
        "       |      | :;;;'     \\",
        "      |  /    |            |",
        "      |       |            |"
      ],
      actionPos: [
        [0, 5],
        [1, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/kitty.cow.js
var require_kitty_cow = __commonJS({
  "node_modules/cowsayjs/cows/kitty.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "kitty",
      template: [
        "     \\",
        "      \\",
        `       ("\`-'  '-/") .___..--' ' "\`-._`,
        "         ` *_ *  )    `-.   (      ) .`-.__. `)",
        "         (_Y_.) ' ._   )   `._` ;  `` -. .-'",
        "      _.. `--'_..-_/   /--' _ .' ,4",
        "   ( i l ),-''  ( l i),'  ( ( ! .-'    "
      ],
      actionPos: [
        [0, 5],
        [1, 5]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/koala.cow.js
var require_koala_cow = __commonJS({
  "node_modules/cowsayjs/cows/koala.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "koala",
      template: [
        "  \\",
        "   \\",
        "       ___  ",
        "     {~._.~}",
        "      ( Y )",
        "     ()~*~()   ",
        "     (_)-(_)   "
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/kosh.cow.js
var require_kosh_cow = __commonJS({
  "node_modules/cowsayjs/cows/kosh.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "kosh",
      template: [
        "    \\",
        "     \\",
        "      \\",
        "  ___       _____     ___",
        " /   \\     /    /|   /   \\",
        "|     |   /    / |  |     |",
        "|     |  /____/  |  |     |     ",
        "|     |  |    |  |  |     |",
        "|     |  | {} | /   |     |",
        "|     |  |____|/    |     |",
        "|     |    |==|     |     |",
        "|      \\___________/      |",
        "|                         |",
        "|                         |"
      ],
      actionPos: [
        [0, 4],
        [1, 5],
        [2, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/luke-koala.cow.js
var require_luke_koala_cow = __commonJS({
  "node_modules/cowsayjs/cows/luke-koala.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "luke-koala",
      template: [
        "  \\",
        "   \\          .",
        "       ___   //",
        "     {~._.~}// ",
        "      ( Y )K/  ",
        "     ()~*~()   ",
        "     (_)-(_)   ",
        "     Luke    ",
        "     Skywalker",
        "     koala   "
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/mech-and-cow.cow.js
var require_mech_and_cow_cow = __commonJS({
  "node_modules/cowsayjs/cows/mech-and-cow.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "mech-and-cow",
      template: [
        "                                   ,-----.",
        "                                   |     |",
        "                                ,--|     |-.",
        "                         __,----|  |     | |",
        "                       ,;::     |  `_____' |",
        "                       `._______|    i^i   |",
        "                                `----| |---'| .",
        "                           ,-------._| |== ||//",
        "                           |       |_|P`.  /'/",
        "                           `-------' 'Y Y/'/'",
        "                                     .== /_",
        "   ^__^                             /   /'|  `i",
        "   (oo)_______                   /'   /  |   |",
        "   (__)       )/             /'    /   |   `i",
        "       ||----w |           ___,;`----'.___L_,-'`__",
        '       ||     ||          i_____;----.____i""____',
        ""
      ]
    };
  }
});

// node_modules/cowsayjs/cows/meow.cow.js
var require_meow_cow = __commonJS({
  "node_modules/cowsayjs/cows/meow.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "meow",
      template: [
        "  \\",
        "   \\ ,   _ ___.--'''`--''//-,-_--_.",
        "      \\`\"' ` || \\\\ \\ \\\\/ / // / ,-\\\\`,_",
        "     /'`  \\ \\ || Y  | \\|/ / // / - |__ `-,",
        '    /@"\\  ` \\ `\\ |  | ||/ // | \\/  \\  `-._`-,_.,',
        "   /  _.-. `.-\\,___/\\ _/|_/_\\_\\/|_/ |     `-._._)",
        "   `-'``/  /  |  // \\__/\\__  /  \\__/ \\",
        "        `-'  /-\\/  | -|   \\__ \\   |-' |",
        "          __/\\ / _/ \\/ __,-'   ) ,' _|'",
        "         (((__/(((_.' ((___..-'((__,'"
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/milk.cow.js
var require_milk_cow = __commonJS({
  "node_modules/cowsayjs/cows/milk.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "milk",
      template: [
        " \\     ____________ ",
        "  \\    |__________|",
        "      /           /\\",
        "     /           /  \\",
        "    /___________/___/|",
        "    |          |     |",
        "    |  ==\\ /== |     |",
        "    |   O   O  | \\ \\ |",
        "    |     <    |  \\ \\|",
        "   /|          |   \\ \\",
        "  / |  \\_____/ |   / /",
        " / /|          |  / /|",
        "/||\\|          | /||\\/",
        "    -------------|   ",
        "        | |    | | ",
        "       <__/    \\__>"
      ],
      actionPos: [
        [0, 1],
        [1, 2]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/moofasa.cow.js
var require_moofasa_cow = __commonJS({
  "node_modules/cowsayjs/cows/moofasa.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "moofasa",
      template: [
        "       \\    ____",
        "        \\  /    \\",
        "          | ^__^ |",
        "          | (oo) |______",
        "          | (__) |      )\\/\\",
        "           \\____/|----w |",
        "                ||     ||",
        "",
        "                 Moofasa"
      ],
      actionPos: [
        [0, 7],
        [1, 8]
      ],
      eyesPos: [
        [3, 13],
        [3, 14]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/moose.cow.js
var require_moose_cow = __commonJS({
  "node_modules/cowsayjs/cows/moose.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "moose",
      template: [
        "  \\",
        "   \\   \\_\\_    _/_/",
        "    \\      \\__/",
        "           (oo)\\_______",
        "           (__)\\       )\\/\\",
        "               ||----w |",
        "               ||     ||"
      ],
      actionPos: [
        [0, 2],
        [1, 3],
        [2, 4]
      ],
      eyesPos: [
        [3, 12],
        [3, 13]
      ],
      tonguePos: [
        [5, 12],
        [5, 13]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/mutilated.cow.js
var require_mutilated_cow = __commonJS({
  "node_modules/cowsayjs/cows/mutilated.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "mutilated",
      template: [
        "       \\   \\_______",
        " v__v   \\  \\   O   )",
        " (oo)      ||----w |",
        " (__)      ||     ||  \\/\\",
        "    "
      ],
      actionPos: [
        [0, 7],
        [1, 8]
      ],
      eyesPos: [
        [2, 2],
        [2, 3]
      ],
      tonguePos: [
        [4, 2],
        [4, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/pony-smaller.cow.js
var require_pony_smaller_cow = __commonJS({
  "node_modules/cowsayjs/cows/pony-smaller.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "pony-smaller",
      template: [
        "     \\      _^^",
        "      \\   _- oo\\",
        "          \\----- \\______",
        "                \\       )\\",
        "                ||-----|| \\",
        "                ||     ||"
      ],
      actionPos: [
        [0, 5],
        [1, 6]
      ],
      eyesPos: [
        [1, 13],
        [1, 14]
      ],
      tonguePos: [
        [3, 11],
        [3, 12]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/pony.cow.js
var require_pony_cow = __commonJS({
  "node_modules/cowsayjs/cows/pony.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "pony",
      template: [
        "       \\          /\\/\\",
        "        \\         \\/\\/",
        "         \\        /   -\\",
        "          \\     /  oo   -\\",
        "           \\  /           \\",
        "             |    ---\\    -\\",
        "             \\--/     \\     \\",
        "                       |      -\\",
        "                        \\       -\\         -------------\\    /-\\",
        "                         \\        \\-------/              ---/    \\",
        "                          \\                                  |\\   \\",
        "                           |                                 / |  |",
        "                           \\                                |  \\  |",
        "                            |                              /    \\ |",
        "                            |                             /     \\ |",
        "                             \\                             \\     \\|",
        "                              -              /--------\\    |      o",
        "                               \\+   +---------          \\   |",
        "                                |   |                   |   \\",
        "                                |   |                    \\   |",
        "                                |   |                    |   \\",
        "                                |   |                     \\   |",
        "                                 \\  |                     |   |",
        "                                 |  |                      \\  \\",
        "                                 |  |                      |   |",
        "                                 +--+                       ---+"
      ],
      actionPos: [
        [0, 7],
        [1, 8],
        [2, 9],
        [3, 10],
        [4, 11]
      ],
      eyesPos: [
        [3, 19],
        [3, 20]
      ],
      tonguePos: [
        [7, 14],
        [7, 15]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/ren.cow.js
var require_ren_cow = __commonJS({
  "node_modules/cowsayjs/cows/ren.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "ren",
      template: [
        "   \\",
        "    \\",
        "    ____  ",
        "   /# /_\\_",
        "  |  |/o\\o\\",
        "  |  \\\\_/_/",
        " / |_   |  ",
        "|  ||\\_ ~| ",
        "|  ||| \\/  ",
        "|  |||_    ",
        " \\//  |    ",
        "  ||  |    ",
        "  ||_  \\   ",
        "  \\_|  o|  ",
        "  /\\___/   ",
        " /  ||||__ ",
        "    (___)_)"
      ],
      actionPos: [
        [0, 3],
        [1, 4]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/satanic.cow.js
var require_satanic_cow = __commonJS({
  "node_modules/cowsayjs/cows/satanic.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "satanic",
      template: [
        "     \\",
        "      \\  (__)  ",
        "         (\\/)  ",
        "  /-------\\/    ",
        " / | 666 ||    ",
        "*  ||----||      ",
        "   ~~    ~~      "
      ],
      actionPos: [
        [0, 5],
        [1, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/sheep.cow.js
var require_sheep_cow = __commonJS({
  "node_modules/cowsayjs/cows/sheep.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "sheep",
      template: [
        "  \\",
        "   \\",
        "       __     ",
        "      UooU\\.'@@@@@@`.",
        "      \\__/(@@@@@@@@@@)",
        "           (@@@@@@@@)",
        "           `YY~~~~YY'",
        "            ||    ||"
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ],
      eyesPos: [
        [3, 7],
        [3, 8]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/skeleton.cow.js
var require_skeleton_cow = __commonJS({
  "node_modules/cowsayjs/cows/skeleton.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "skeleton",
      template: [
        "          \\      (__)      ",
        "           \\     /oo|  ",
        '            \\   (_"_)*+++++++++*',
        "                   //I#\\\\\\\\\\\\\\\\I\\",
        "                   I[I|I|||||I I `",
        "                   I`I'///'' I I",
        "                   I I       I I",
        "                   ~ ~       ~ ~",
        "                     Scowleton"
      ],
      actionPos: [
        [0, 10],
        [1, 11],
        [2, 12]
      ],
      eyesPos: [
        [1, 18],
        [1, 19]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/small.cow.js
var require_small_cow = __commonJS({
  "node_modules/cowsayjs/cows/small.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "small",
      eyes: "..",
      template: [
        "       \\   ,__,",
        "        \\  (..)____",
        "           (__)    )\\",
        "              ||--|| *"
      ],
      defEyes: "..",
      actionPos: [
        [0, 7],
        [1, 8]
      ],
      eyesPos: [
        [1, 12],
        [1, 13]
      ],
      tonguePos: [
        [3, 12],
        [3, 13]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/snowman.cow.js
var require_snowman_cow = __commonJS({
  "node_modules/cowsayjs/cows/snowman.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "snowman",
      template: [
        "   \\",
        " ___###",
        "   /oo\\ |||",
        "   \\  / \\|/",
        '   /""\\  I',
        "()|    |(I)",
        "   \\  /  I",
        '  /""""\\ I',
        " |      |I",
        " |      |I",
        "  \\____/ I"
      ],
      actionPos: [
        [0, 3]
      ],
      eyesPos: [
        [2, 4],
        [2, 5]
      ],
      tonguePos: [
        [3, 4],
        [3, 5]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/sodomized.cow.js
var require_sodomized_cow = __commonJS({
  "node_modules/cowsayjs/cows/sodomized.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "sodomized",
      template: [
        "      \\                _",
        "       \\              (_)",
        "        \\   ^__^       / \\",
        "         \\  (oo)\\_____/_\\ \\",
        "            (__)\\       ) /",
        "                ||----w ((",
        "                ||     ||>>"
      ],
      actionPos: [
        [0, 6],
        [1, 7],
        [2, 8],
        [3, 9]
      ],
      eyesPos: [
        [3, 13],
        [3, 14]
      ],
      tonguePos: [
        [5, 13],
        [5, 14]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/stegosaurus.cow.js
var require_stegosaurus_cow = __commonJS({
  "node_modules/cowsayjs/cows/stegosaurus.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "stegosaurus",
      template: [
        "\\                             .       .",
        " \\                           / `.   .' \"",
        "  \\                  .---.  <    > <    >  .---.",
        "   \\                 |    \\  \\ - ~ ~ - /  /    |",
        "         _____          ..-~             ~-..-~",
        "        |     |   \\~~~\\.'                    `./~~~/",
        "       ---------   \\__/                        \\__/",
        `      .'  O    \\     /               /       \\  "`,
        "     (_____,    `._.'               |         }  \\/~~~/",
        "      `----.          /       }     |        /    \\__/",
        "            `-.      |       /      |       /      `. ,~~|",
        "                ~-.__|      /_ - ~ ^|      /- _      `..-'",
        "                     |     /        |     /     ~-.     `-. _  _  _",
        "                     |_____|        |_____|         ~ - . _ _ _ _ _>"
      ],
      actionPos: [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/stimpy.cow.js
var require_stimpy_cow = __commonJS({
  "node_modules/cowsayjs/cows/stimpy.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "stimpy",
      template: [
        "  \\     .    _  .    ",
        "   \\    |\\_|/__/|    ",
        "       / / \\/ \\  \\  ",
        "      /__|O||O|__ \\ ",
        "     |/_ \\_/\\_/ _\\ |  ",
        "     | | (____) | ||  ",
        "     \\/\\___/\\__/  // ",
        "     (_/         ||",
        "      |          ||",
        "      |          ||\\   ",
        "       \\        //_/  ",
        "        \\______//",
        "       __ || __||",
        "      (____(____)"
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/supermilker.cow.js
var require_supermilker_cow = __commonJS({
  "node_modules/cowsayjs/cows/supermilker.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "supermilker",
      template: [
        "  \\   ^__^",
        "   \\  (oo)\\_______        ________",
        "      (__)\\       )\\/\\    |Super |",
        "          ||----W |       |Milker|",
        "          ||    UDDDDDDDDD|______|"
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ],
      eyesPos: [
        [1, 7],
        [1, 8]
      ],
      tonguePos: [
        [3, 7],
        [3, 8]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/surgery.cow.js
var require_surgery_cow = __commonJS({
  "node_modules/cowsayjs/cows/surgery.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "surgery",
      template: [
        "          \\           \\  /",
        "           \\           \\/",
        "               (__)    /\\",
        "               (oo)   O  O",
        "               _\\/_   //",
        "         *    (    ) //",
        "          \\  (\\\\    //",
        "           \\(  \\\\    )",
        "            (   \\\\   )   /\\",
        "  ___[\\______/^^^^^^^\\__/) o-)__",
        " |\\__[=======______//________)__\\",
        " \\|_______________//____________|",
        "     |||      || //||     |||",
        "     |||      || @.||     |||",
        "      ||      \\/  .\\/      ||",
        "                 . .",
        "                '.'.`",
        "",
        "            COW-OPERATION"
      ],
      actionPos: [
        [0, 10],
        [1, 11]
      ],
      eyesPos: [
        [3, 16],
        [3, 17]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/suse.cow.js
var require_suse_cow = __commonJS({
  "node_modules/cowsayjs/cows/suse.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "suse",
      template: [
        "  \\",
        "   \\____",
        "  /@    ~-.",
        "  \\/ __ .- |",
        "   // //  @"
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/telebears.cow.js
var require_telebears_cow = __commonJS({
  "node_modules/cowsayjs/cows/telebears.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "telebears",
      template: [
        "      \\                _",
        "       \\              (_)   <-- TeleBEARS",
        "        \\   ^__^       / \\",
        "         \\  (oo)\\_____/_\\ \\",
        "            (__)\\  you  ) /",
        "                ||----w ((",
        "                ||     ||>> "
      ],
      actionPos: [
        [0, 6],
        [1, 7],
        [2, 8],
        [3, 9]
      ],
      eyesPos: [
        [3, 13],
        [3, 14]
      ],
      tonguePos: [
        [5, 13],
        [5, 14]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/three-eyes.cow.js
var require_three_eyes_cow = __commonJS({
  "node_modules/cowsayjs/cows/three-eyes.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "three-eyes",
      template: [
        "        \\  ^___^",
        "         \\ (ooo)\\_______",
        "           (___)\\       )\\/\\",
        "                ||----w |",
        "                ||     ||"
      ],
      actionPos: [
        [0, 8],
        [1, 9]
      ],
      eyesPos: [
        [1, 12],
        [1, 13],
        [1, 14]
      ],
      tonguePos: [
        [3, 12],
        [3, 13]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/turkey.cow.js
var require_turkey_cow = __commonJS({
  "node_modules/cowsayjs/cows/turkey.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "turkey",
      template: [
        "  \\                                  ,+*^^*+___+++_",
        "   \\                           ,*^^^^              )",
        "    \\                       _+*                     ^**+_",
        "     \\                    +^       _ _++*+_+++_,         )",
        "              _+^^*+_    (     ,+*^ ^          \\+_        )",
        "             {       )  (    ,(    ,_+--+--,      ^)      ^\\",
        "            { (@)    } f   ,(  ,+-^ __*_*_  ^^\\_   ^\\       )",
        "           {:;-/    (_+*-+^^^^^+*+*<_ _++_)_    )    )      /",
        "          ( /  (    (        ,___    ^*+_+* )   <    <      \\",
        "           U _/     )    *--<  ) ^\\-----++__)   )    )       )",
        "            (      )  _(^)^^))  )  )\\^^^^^))^*+/    /       /",
        "          (      /  (_))_^)) )  )  ))^^^^^))^^^)__/     +^^",
        "         (     ,/    (^))^))  )  ) ))^^^^^^^))^^)       _)",
        "          *+__+*       (_))^)  ) ) ))^^^^^^))^^^^^)____*^",
        "          \\             \\_)^)_)) ))^^^^^^^^^^))^^^^)",
        "           (_             ^\\__^^^^^^^^^^^^))^^^^^^^)",
        "             ^\\___            ^\\__^^^^^^))^^^^^^^^)\\\\",
        "                  ^^^^^\\uuu/^^\\uuu/^^^^\\^\\^\\^\\^\\^\\^\\^\\",
        "                     ___) >____) >___   ^\\_\\_\\_\\_\\_\\_\\)",
        "                    ^^^//\\\\_^^//\\\\_^       ^(\\_\\_\\_\\)",
        "                      ^^^ ^^ ^^^ ^"
      ],
      actionPos: [
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/turtle.cow.js
var require_turtle_cow = __commonJS({
  "node_modules/cowsayjs/cows/turtle.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "turtle",
      template: [
        "    \\                                  ___-------___",
        "     \\                             _-~~             ~~-_",
        "      \\                         _-~                    /~-_",
        "             /^\\__/^\\         /~  \\                   /    \\",
        "           /|  O|| O|        /      \\_______________/        \\",
        "          | |___||__|      /       /                \\          \\",
        "          |          \\    /      /                    \\          \\",
        "          |   (_______) /______/                        \\_________ \\",
        "          |         / /         \\                      /            \\",
        "           \\         \\^\\\\         \\                  /               \\     /",
        "             \\         ||           \\______________/      _-_       //\\__//",
        "               \\       ||------_-~~-_ ------------- \\ --/~   ~\\    || __/",
        "                 ~-----||====/~     |==================|       |/~~~~~",
        "                  (_(__/  ./     /                    \\_\\      \\.",
        "                         (_(___/                         \\_____)_)"
      ],
      actionPos: [
        [0, 4],
        [1, 5],
        [2, 6]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/tux.cow.js
var require_tux_cow = __commonJS({
  "node_modules/cowsayjs/cows/tux.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "tux",
      template: [
        "   \\",
        "    \\",
        "        .--.",
        "       |o_o |",
        "       |:_/ |",
        "      //   \\ \\",
        "     (|     | )",
        "    /'\\_   _/`\\",
        "    \\___)=(___/",
        ""
      ],
      actionPos: [
        [0, 3],
        [1, 4]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/udder.cow.js
var require_udder_cow = __commonJS({
  "node_modules/cowsayjs/cows/udder.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "udder",
      template: [
        "  \\",
        "   \\    (__)",
        "        o o\\",
        "       ('') \\---------",
        "          \\           \\",
        "           |          |\\",
        "           ||---(  )_|| *",
        "           ||    UU  ||",
        "           ==        =="
      ],
      actionPos: [
        [0, 2],
        [1, 3]
      ],
      eyesPos: [
        [2, 8],
        [2, 10]
      ],
      tonguePos: [
        [4, 8],
        [4, 9]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/unipony-smaller.cow.js
var require_unipony_smaller_cow = __commonJS({
  "node_modules/cowsayjs/cows/unipony-smaller.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "unipony-smaller",
      template: [
        "   \\        \\",
        "    \\        \\",
        "     \\       _\\^",
        "      \\    _- oo\\",
        "           \\---- \\______",
        "                 \\       )\\",
        "                ||-----||  \\",
        "                ||     ||"
      ],
      actionPos: [
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 6]
      ],
      eyesPos: [
        [3, 14],
        [3, 15]
      ],
      tonguePos: [
        [5, 12],
        [5, 13]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/unipony.cow.js
var require_unipony_cow = __commonJS({
  "node_modules/cowsayjs/cows/unipony.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "unipony",
      template: [
        "   \\             \\",
        "    \\             \\_",
        "     \\             \\\\",
        "      \\             \\\\/\\",
        "       \\            _\\\\/",
        "        \\         /   -\\",
        "         \\      /  oo   -\\",
        "          \\   /           \\",
        "             |    ---\\    -\\",
        "             \\--/     \\     \\",
        "                       |      -\\",
        "                        \\       -\\         -------------\\    /-\\",
        "                         \\        \\-------/              ---/    \\",
        "                          \\                                  |\\   \\",
        "                           |                                 / |  |",
        "                           \\                                |  \\  |",
        "                            |                              /    \\ |",
        "                            |                             /     \\ |",
        "                             \\                             \\     \\|",
        "                              -              /--------\\    |      o",
        "                               \\+   +---------          \\   |",
        "                                |   |                   |   \\",
        "                                |   |                    \\   |",
        "                                |   |                    |   \\",
        "                                |   |                     \\   |",
        "                                 \\  |                     |   |",
        "                                 |  |                      \\  \\",
        "                                 |  |                      |   |",
        "                                 +--+                       ---+"
      ],
      actionPos: [
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 6],
        [4, 7],
        [5, 8],
        [6, 9],
        [7, 10]
      ],
      eyesPos: [
        [6, 19],
        [6, 20]
      ],
      tonguePos: [
        [10, 14],
        [10, 15]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/vader-koala.cow.js
var require_vader_koala_cow = __commonJS({
  "node_modules/cowsayjs/cows/vader-koala.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "vader-koala",
      template: [
        "   \\",
        "    \\        .",
        "     .---.  //",
        "    Y|o o|Y//",
        "   /_(i=i)K/",
        "   ~()~*~()~",
        "    (_)-(_)",
        "",
        "     Darth",
        "     Vader",
        "     koala"
      ],
      actionPos: [
        [0, 3],
        [1, 4]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/vader.cow.js
var require_vader_cow = __commonJS({
  "node_modules/cowsayjs/cows/vader.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "vader",
      template: [
        "        \\    ,-^-.",
        "         \\   !oYo!",
        "          \\ /./=\\.\\______",
        "               ##        )\\/\\",
        "                ||-----w||",
        "                ||      ||",
        "",
        "               Cowth Vader"
      ],
      actionPos: [
        [0, 8],
        [1, 9],
        [2, 10]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/www.cow.js
var require_www_cow = __commonJS({
  "node_modules/cowsayjs/cows/www.cow.js"(exports, module) {
    "use strict";
    module.exports = {
      name: "www",
      template: [
        "        \\   ^__^",
        "         \\  (oo)\\_______",
        "            (__)\\       )\\/\\",
        "                ||--WWW |",
        "                ||     ||"
      ],
      actionPos: [
        [0, 8],
        [1, 9]
      ],
      eyesPos: [
        [1, 13],
        [1, 14]
      ],
      tonguePos: [
        [3, 13],
        [3, 14]
      ]
    };
  }
});

// node_modules/cowsayjs/cows/index.js
var require_cows = __commonJS({
  "node_modules/cowsayjs/cows/index.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var corral = [
      require_default_cow(),
      require_apt_cow(),
      require_beavis_zen_cow(),
      require_blowfish_cow(),
      require_bong_cow(),
      require_bud_frogs_cow(),
      require_bunny_cow(),
      require_calvin_cow(),
      require_cheese_cow(),
      require_cock_cow(),
      require_cower_cow(),
      require_daemon_cow(),
      require_dragon_and_cow_cow(),
      require_dragon_cow(),
      require_duck_cow(),
      require_elephant_in_snake_cow(),
      require_elephant_cow(),
      require_eyes_cow(),
      require_flaming_sheep_cow(),
      require_fox_cow(),
      require_ghostbusters_cow(),
      require_gnu_cow(),
      require_head_in_cow(),
      require_hellokitty_cow(),
      require_kangaroo_cow(),
      require_kiss_cow(),
      require_kitty_cow(),
      require_koala_cow(),
      require_kosh_cow(),
      require_luke_koala_cow(),
      require_mech_and_cow_cow(),
      require_meow_cow(),
      require_milk_cow(),
      require_moofasa_cow(),
      require_moose_cow(),
      require_mutilated_cow(),
      require_pony_smaller_cow(),
      require_pony_cow(),
      require_ren_cow(),
      require_satanic_cow(),
      require_sheep_cow(),
      require_skeleton_cow(),
      require_small_cow(),
      require_snowman_cow(),
      require_sodomized_cow(),
      require_stegosaurus_cow(),
      require_stimpy_cow(),
      require_supermilker_cow(),
      require_surgery_cow(),
      require_suse_cow(),
      require_telebears_cow(),
      require_three_eyes_cow(),
      require_turkey_cow(),
      require_turtle_cow(),
      require_tux_cow(),
      require_udder_cow(),
      require_unipony_smaller_cow(),
      require_unipony_cow(),
      require_vader_koala_cow(),
      require_vader_cow(),
      require_www_cow()
    ];
    var customCorral = [];
    function truncate(str, len) {
      return typeof str === "string" ? str.slice(0, len) : "";
    }
    function fix(value, empty, undef, len) {
      if (typeof value !== "string") {
        return truncate(undef, len);
      }
      if (value.length === 0) {
        return truncate(empty, len);
      }
      return truncate(value, len);
    }
    function validatePositionArray(arr) {
      if (arr === void 0) {
        return true;
      }
      if (!Array.isArray(arr)) {
        return false;
      }
      return arr.every(function(pos) {
        return Array.isArray(pos) && pos.length === 2 && typeof pos[0] === "number" && typeof pos[1] === "number";
      });
    }
    function copyCow(cow) {
      var copier = function(pos) {
        return [pos[0], pos[1]];
      };
      return {
        name: cow.name,
        defEyes: cow.defEyes,
        defTongue: cow.defTongue,
        template: cow.template.slice(),
        actionPos: cow.actionPos ? cow.actionPos.map(copier) : void 0,
        eyesPos: cow.eyesPos ? cow.eyesPos.map(copier) : void 0,
        tonguePos: cow.tonguePos ? cow.tonguePos.map(copier) : void 0
      };
    }
    function validateCow(cow, name) {
      var valid = true;
      valid = valid && typeof cow === "object" && cow !== null && !Array.isArray(cow);
      valid = valid && Array.isArray(cow.template);
      valid = valid && cow.template.every(function(line) {
        return typeof line === "string";
      });
      valid = valid && (cow.defEyes === void 0 || typeof cow.defEyes === "string");
      valid = valid && (cow.defTongue === void 0 || typeof cow.defTongue === "string");
      valid = valid && validatePositionArray(cow.actionPos);
      valid = valid && validatePositionArray(cow.eyesPos);
      valid = valid && validatePositionArray(cow.tonguePos);
      if (name) {
        valid = valid && typeof cow.name === "string" && cow.name.length > 0;
      }
      return valid;
    }
    function getCow(name) {
      var cow;
      if (typeof name === "string") {
        cow = utils.find(corral.concat(customCorral), function(cow2) {
          return cow2.name === name;
        });
      }
      if (cow === void 0) {
        cow = corral[0];
      }
      return copyCow(cow);
    }
    function addCow(cow) {
      if (!validateCow(cow, true)) {
        return false;
      }
      if (getCow(cow.name).name === cow.name) {
        return false;
      }
      customCorral.push(cow);
      customCorral.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      return true;
    }
    function removeCow(name) {
      if (typeof name !== "string") {
        return void 0;
      }
      var ind = customCorral.findIndex(function(cow) {
        return cow.name === name;
      });
      if (ind !== -1) {
        return customCorral.splice(ind, 1)[0];
      }
      return void 0;
    }
    function renderCow(cow, action, eyes, tongue) {
      var lines = cow.template.slice();
      var values = [];
      var act = -1;
      if (cow.tonguePos) {
        values.push({ pos: cow.tonguePos, str: fix(tongue, cow.defTongue, "  ", 2) });
      }
      if (cow.eyesPos) {
        values.push({ pos: cow.eyesPos, str: fix(eyes, cow.defEyes, "oo", 2) });
      }
      if (cow.actionPos) {
        values.push({ pos: cow.actionPos, str: fix(action, void 0, void 0, 1) });
        act = values.length - 1;
      }
      values.forEach(function(val, i) {
        var fix2 = 0;
        var f = i !== act;
        val.pos.forEach(function(pos, j) {
          var char = val.str[j] || (f && j === 1 ? "" : val.str.slice(-1));
          var pos0 = pos[0];
          var pos1 = pos[1] - fix2;
          var line = lines[pos0];
          lines[pos0] = line.slice(0, pos1) + char + line.slice(pos1 + 1);
          if (char.length === 0) {
            ++fix2;
          }
        });
      });
      return lines.join("\n");
    }
    module.exports = {
      corral: corral.map(copyCow),
      customCorral,
      validateCow,
      getCow,
      addCow,
      removeCow,
      renderCow
    };
  }
});

// node_modules/cowsayjs/lib/index.js
var require_lib = __commonJS({
  "node_modules/cowsayjs/lib/index.js"(exports, module) {
    "use strict";
    var box = require_box();
    var mode = require_mode();
    var cows = require_cows();
    function extendOptions(options, property, value) {
      var extended = typeof options === "object" && options !== null ? {
        message: options.message,
        cow: options.cow,
        mode: options.mode,
        eyes: options.eyes,
        tongue: options.tongue,
        wrap: options.wrap,
        action: options.action
      } : {};
      extended[property] = value;
      return extended;
    }
    function moo(message, options) {
      var opts = typeof message === "object" && message !== null ? message : extendOptions(options, "message", message);
      var action = opts.action === "think" ? "think" : "say";
      var act = action === "think" ? "o" : "\\";
      var eyes;
      var tongue;
      if (typeof opts.mode === "string") {
        var face = mode.modeFace(opts.mode);
        eyes = face.eyes;
        tongue = face.tongue;
      }
      if (typeof opts.eyes === "string" && eyes === void 0) {
        eyes = opts.eyes;
      }
      if (typeof opts.tongue === "string" && tongue === void 0) {
        tongue = opts.tongue;
      }
      var cow;
      switch (typeof opts.cow) {
        case "string":
          cow = cows.getCow(opts.cow);
          break;
        case "object":
          cow = cows.validateCow(opts.cow) ? opts.cow : cows.corral[0];
          break;
        default:
          cow = cows.corral[0];
      }
      return box.perform(action, opts.message, opts.wrap) + cows.renderCow(cow, act, eyes, tongue);
    }
    function cowsay3(message, options) {
      return typeof message === "object" && message !== null ? moo(extendOptions(message, "action", "say")) : moo(message, extendOptions(options, "action", "say"));
    }
    function cowthink(message, options) {
      return typeof message === "object" && message !== null ? moo(extendOptions(message, "action", "think")) : moo(message, extendOptions(options, "action", "think"));
    }
    module.exports = {
      moo,
      cowsay: cowsay3,
      cowthink
    };
  }
});

// src/js/cb/cb-api.mts
var CB_USER_GROUPS = {
  owner: { userColor: "o" },
  moderator: { userColor: "m", noticeColor: "red" },
  fanclub: { userColor: "f", noticeColor: "green" },
  darkPurple: { userColor: "l", noticeColor: "darkpurple" },
  lightPurple: { userColor: "p", noticeColor: "lightpurple" },
  darkBlue: { userColor: "tr", noticeColor: "darkblue" },
  lightBlue: { userColor: "t", noticeColor: "lightblue" },
  grey: { userColor: "g", noticeColor: "red" }
};

// src/js/cli/cli-print.mts
var NOTICE_COLOR_THEME = {
  staff: {
    color: "Black",
    bgColor: "LightSteelBlue",
    fontWeight: "normal"
  },
  user: {
    color: "Black",
    bgColor: "HotPink",
    fontWeight: "normal"
  },
  error: {
    color: "White",
    bgColor: "Crimson",
    fontWeight: "normal"
  },
  userError: {
    color: "White",
    bgColor: "Crimson",
    fontWeight: "bold"
  },
  help: {
    color: "Black",
    bgColor: "Lavender",
    fontWeight: "normal"
  },
  timer: {
    color: "Black",
    bgColor: "linear-gradient(to right, rgba(255, 102, 34, 0) 5%, rgba(255, 102, 34, 0.2) 20%, rgba(255, 102, 34, 0.4) 73%, rgba(255, 102, 34, 0.2))",
    fontWeight: "normal"
  }
};
function printCommandResult(ctx, message, theme = NOTICE_COLOR_THEME.staff) {
  const { user, room, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: user.username
  };
  if (typeof room != "undefined") {
    room.sendNotice(message, p);
  }
}
function printToOwner(ctx, message, theme = NOTICE_COLOR_THEME.staff) {
  const { user, room, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: room.owner
  };
  if (typeof room != "undefined") {
    room.sendNotice(message, p);
  }
}
function printToUser(ctx, message, username, theme = NOTICE_COLOR_THEME.userError) {
  const { user = null, room, kv = null } = ctx;
  const p = {
    ...theme,
    toUsername: username
  };
  if (typeof room != "undefined") {
    room.sendNotice(message, p);
  }
}
function printToEveryone(ctx, message, theme = NOTICE_COLOR_THEME.user) {
  const { user = null, room, kv = null } = ctx;
  const p = {
    ...theme
  };
  if (typeof room != "undefined") {
    room.sendNotice(message, p);
  }
}

// src/js/defaults.mts
var COMMAND_START_CHAR = "!";
var BASE_STAFF_COMMAND = "!zeus";
var BASE_USER_COMMAND = "!jarvis";
var CB_SETTINGS_LIST_SEPARATOR = ",";
var AVAILLABLE_LIVE_SETTINGS_NAMES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20"
];

// src/js/tool/kv.mts
var KV_KEYS = {
  liveSettings: "liveSettings",
  sessionStartDate: "sessionStartDate",
  sessionLastEnterDate: "sessionLastEnterDate",
  sessionLastLeaveDate: "sessionLastLeaveDate",
  currentSession: "currentSession",
  sessionHistory: "sessionHistory",
  callbacksManager: "callbacksManager",
  userTipsKeysMap: "userTipsKeysMap",
  userChatKeysMap: "userChatKeysMap",
  currentGlobalStatsTS: "currentGlobalStatsTS",
  ModuleTimer: "ModuleTimer"
};

// src/js/settings.mts
var SETTINGS_CONVERT = {
  number: "number",
  listString: "listString",
  boolean: "boolean"
};
var SETTINGS_INFO = {
  cliBroadcastUserCmd: {
    defaultValue: false,
    desc: "Broadcast User command to everyone in chat",
    fromSettings: false,
    liveUpdate: true,
    convert: SETTINGS_CONVERT.boolean
  },
  cliBroadcastStaffCmd: {
    defaultValue: false,
    desc: "Broadcast Amdin command to everyone in chat",
    fromSettings: false
  },
  cliBaseStaffCommand: {
    defaultValue: BASE_STAFF_COMMAND,
    fromSettings: true,
    desc: "Command prefix for Staff commands"
  },
  cliBaseUserCommand: {
    defaultValue: BASE_USER_COMMAND,
    fromSettings: true,
    desc: "Command prefix for User commands"
  },
  debugAllowedUsernames: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    desc: "username of the user allowed to use debug commands"
  },
  debugEnableRemoteUser: {
    defaultValue: false,
    fromSettings: true,
    desc: "allowing a remote user to use debug commands"
  },
  debugAllowOwner: {
    defaultValue: false,
    fromSettings: true,
    desc: "allowing room owner to use debug commands"
  },
  userStaffMembersAdmin: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    desc: "staff users allowed to use Staff/privileged commands"
  },
  userStaffMembersMonitor: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    liveUpdate: true,
    desc: "staff users only allowed monitoring commands"
  },
  sessionMinTimeBetweenSession: {
    defaultValue: 2 * 60,
    fromSettings: true,
    desc: "Minimum time between 2 different sessions (default 2h)"
  },
  sessionMaxTimeToRejoin: {
    defaultValue: 30,
    fromSettings: true,
    desc: "Maximum time to rejoin a session, to keep same session (default 30min)"
  },
  sessionMaxSessionLength: {
    defaultValue: 8 * 60,
    fromSettings: true,
    desc: "How much time a session will last (default 8h)"
  },
  sessionHistoryMaxLength: {
    defaultValue: 10,
    fromSettings: false,
    desc: "How many sessions to keep in history"
  },
  chatBadWords: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    liveUpdate: false,
    desc: "words that will be removed from chat message"
  },
  chatFuzzyScoreForBW: {
    defaultValue: 60,
    fromSettings: true,
    liveUpdate: false,
    desc: "minimal fuzzy similarity score to consider word is BW, range 0-100, 0 to disable"
  },
  chatVeryBadWords: {
    defaultValue: [],
    fromSettings: true,
    convert: SETTINGS_CONVERT.listString,
    liveUpdate: false,
    desc: "if chat message contains one of those words, message is spammed"
  },
  chatFuzzyScoreForVBW: {
    defaultValue: 60,
    fromSettings: true,
    liveUpdate: false,
    desc: "minimal fuzzy similarity score to consider word is VBW, range 0-100, 0 to disable"
  },
  chatNoticeToUserVBW: {
    defaultValue: "Be Polite, Please ! No bad words !",
    fromSettings: true,
    liveUpdate: false,
    desc: "Notice to send to user using very bad words"
  },
  cowsayCowName: {
    defaultValue: "default",
    fromSettings: true,
    liveUpdate: true,
    desc: "Choose your cow"
  },
  cowsayColor: {
    defaultValue: "black",
    fromSettings: true,
    liveUpdate: false,
    desc: "Front Color"
  },
  cowsayBgColor: {
    defaultValue: "linear-gradient(to right, rgba(128, 0, 128, 0.2) 20%, rgba(128, 0, 128, 0.4) 73%, rgba(128, 0, 128, 0.2))",
    fromSettings: true,
    liveUpdate: false,
    desc: "Background Color"
  }
};
function getSettings() {
  const settings = {};
  Object.entries(SETTINGS_INFO).forEach(([n, sInfo]) => {
    const {
      defaultValue = null,
      desc = null,
      fromSettings = null,
      forceUpdate = null,
      liveUpdate = null,
      convert = null
    } = sInfo;
    const name = n;
    if (name) {
      settings[name] = defaultValue;
      if (fromSettings) {
        let key = name;
        switch (typeof fromSettings) {
          case "boolean":
            key = name;
            break;
          case "string":
            key = fromSettings;
            break;
          default:
            break;
        }
        try {
          const v = $settings[key];
          if (v || forceUpdate) {
            if (convert && v) {
              let c = null;
              let l = null;
              let nv = null;
              switch (convert) {
                case SETTINGS_CONVERT.number:
                  c = parseInt(v);
                  if (typeof c === "number" && c) {
                    settings[name] = c;
                  } else {
                    settings[name] = defaultValue;
                  }
                  break;
                case SETTINGS_CONVERT.listString:
                  l = v.split(CB_SETTINGS_LIST_SEPARATOR);
                  nv = [];
                  l.forEach((u) => {
                    nv.push(u.trim());
                  });
                  settings[name] = nv;
                  break;
                default:
                  settings[name] = v;
                  break;
              }
            } else {
              settings[name] = v;
            }
          }
        } catch (ReferenceError2) {
          settings[name] = defaultValue;
        }
      }
      if (liveUpdate) {
        const liveSettings = $kv.get(KV_KEYS.liveSettings, {});
        if (Object.hasOwn(liveSettings, name)) {
          const v = settings[name];
          const nv = liveSettings[name];
          if (Array.isArray(v) && Array.isArray(nv)) {
            settings[name] = v.concat(nv);
          } else {
            settings[name] = nv;
          }
        }
      }
    }
  });
  return settings;
}
function updateSettings() {
  SETTINGS = getSettings();
}
var SETTINGS = getSettings();
updateSettings();

// src/js/tool/tool.mts
var SPACE_NON_SECABLE = "\xA0";
function getRandomInt(min, max) {
  const tMin = Math.ceil(min);
  const tMax = Math.floor(max);
  return Math.floor(Math.random() * (tMax - tMin) + tMin);
}
function getRandomID(strengh = 2) {
  const il = [];
  for (let index = 0; index < strengh; index++) {
    il.push(getRandomInt(0, 1048576));
  }
  let id = "";
  il.forEach((element) => {
    id = id + element.toString(16);
  });
  return id;
}
function getObjectProperty(obj, prop, defaultValue = null, updateObject = true) {
  if (Object.hasOwn(obj, prop)) {
    return obj[prop];
  } else {
    if (updateObject) {
      obj[prop] = defaultValue;
    }
    return defaultValue;
  }
}

// src/js/app-module/UserTipInfo.mts
var UserTipInfo = class _UserTipInfo {
  tipList;
  tipTotal;
  userName;
  sessionID;
  key;
  constructor(ctx, userName) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    this.tipList = [];
    this.tipTotal = 0;
    this.userName = userName;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.key = _UserTipInfo.getUserTipKey(ctx, userName);
  }
  static getFromKV(ctx, userName) {
    const userTipInfo = new _UserTipInfo(ctx, userName);
    userTipInfo.loadFromKV(ctx);
    return userTipInfo;
  }
  static getUserTipKey(ctx, userName) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    let key = null;
    const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
    if (Object.hasOwn(keysMap, userName)) {
      key = keysMap[userName];
    } else {
      key = userName + "-" + getRandomID(4);
      keysMap[userName] = key;
      kv.set(KV_KEYS.userTipsKeysMap, keysMap);
    }
    return key;
  }
  static updateUserTips(ctx) {
    const { message = null, user, room = null, kv = null, tip = null } = ctx;
    const userName = user.username;
    const userTipInfo = _UserTipInfo.getFromKV(ctx, userName);
    userTipInfo.addTip(ctx);
    userTipInfo.storeToKV(ctx);
  }
  static clearAll(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
    const keyList = Object.values(keysMap);
    keyList.forEach((key) => {
      kv.remove(key);
    });
    kv.remove(KV_KEYS.userTipsKeysMap);
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const userTipInfo = kv.get(this.key, null);
    if (userTipInfo) {
      this.tipList = userTipInfo.tipList;
      this.tipTotal = userTipInfo.tipTotal;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(this.key, this);
  }
  addTip(ctx) {
    const { message = null, user, room = null, kv = null, tip } = ctx;
    const extendedTip = {
      tokens: tip.tokens,
      message: tip.message,
      isAnon: tip.isAnon,
      date: Date.now(),
      userName: user.username,
      sessionID: this.sessionID
    };
    this.tipList.push(extendedTip);
    this.tipTotal = this.tipTotal + tip.tokens;
  }
  toString() {
    let m = "";
    m = m + JSON.stringify(this.tipList);
    m = m + "\n" + JSON.stringify(this.tipTotal);
    return m;
  }
};

// src/js/app-module/GlobalStatsTimeSeries.mts
var GlobalStatsTimeSeries = class _GlobalStatsTimeSeries {
  sessionID;
  timeSeries;
  tsMetadata;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.timeSeries = {};
    this.tsMetadata = {};
  }
  static TS_TYPES;
  static TS_METADATA;
  static DEFAULT_TS_METADATA = {
    userTips: {
      size: 300,
      span: 6e4
    },
    message: {
      size: 300,
      span: 6e4
    }
  };
  static FALLBACK_TS_SIZE = 300;
  // number of buckets in TS
  static FALLBACK_TS_SPAN = 6e4;
  // duration of "bucket" in TS
  static getFromKV(ctx) {
    const globalTipStat = new _GlobalStatsTimeSeries(ctx);
    globalTipStat.loadFromKV(ctx);
    return globalTipStat;
  }
  static initNewStatObj(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.remove(KV_KEYS.currentGlobalStatsTS);
    const globalStatsTS = new _GlobalStatsTimeSeries(ctx);
    globalStatsTS.storeToKV(ctx);
    return globalStatsTS;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const globalTipStat = kv.get(KV_KEYS.currentGlobalStatsTS, null);
    if (globalTipStat) {
      this.timeSeries = globalTipStat.timeSeries;
      this.tsMetadata = globalTipStat.tsMetadata;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(KV_KEYS.currentGlobalStatsTS, this);
  }
  getTimeSerieNames(tsType) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    return Object.keys(allTS);
  }
  getTimeSerie(tsType, tsName) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    if (Object.hasOwn(allTS, tsName)) {
      return allTS[tsName];
    } else {
      return this.initTimeSerie(tsType, tsName);
    }
  }
  initTimeSerie(tsType, tsName) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    const nbucket = this.getTimeSerieSize(tsType, tsName);
    const list = new Array(nbucket);
    list.fill(0);
    allTS[tsName] = list;
    let newRefDate = 0;
    let trd = 0;
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    Object.keys(allTSmetadata).forEach((tsName2) => {
      trd = this.getTimeSerieMetadata(
        tsType,
        tsName2,
        "refDate" /* refDate */,
        0
      );
      if (trd > newRefDate) {
        newRefDate = trd;
      }
    });
    if (newRefDate === 0) {
      const span = this.getTimeSerieSpan(tsType, tsName);
      newRefDate = Date.now() + span;
    }
    this.setTimeSerieMetadata(
      tsType,
      tsName,
      "refDate" /* refDate */,
      newRefDate
    );
    return list;
  }
  getTimeSerieSize(tsType, tsName) {
    return this.getTimeSerieMetadata(
      tsType,
      tsName,
      "size" /* size */,
      _GlobalStatsTimeSeries.FALLBACK_TS_SIZE
    );
  }
  getTimeSerieSpan(tsType, tsName) {
    return this.getTimeSerieMetadata(
      tsType,
      tsName,
      "span" /* span */,
      _GlobalStatsTimeSeries.FALLBACK_TS_SPAN
    );
  }
  getTimeSerieMetadata(tsType, tsName, metadataType, fallbackValue) {
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    const metadataObj = getObjectProperty(allTSmetadata, tsName, {});
    const typeDefaultValues = getObjectProperty(
      _GlobalStatsTimeSeries.DEFAULT_TS_METADATA,
      tsType,
      {},
      false
    );
    const defaultValue = getObjectProperty(typeDefaultValues, metadataType, fallbackValue, false);
    const metadata = getObjectProperty(
      metadataObj,
      metadataType,
      defaultValue
    );
    return metadata;
  }
  setTimeSerieMetadata(tsType, tsName, metadataType, newValue) {
    const allTSmetadata = getObjectProperty(this.tsMetadata, tsType, {});
    const metadataObj = getObjectProperty(allTSmetadata, tsName, {});
    metadataObj[metadataType] = newValue;
  }
  slideAllTimeSeries(currentDate, tsType) {
    const allTS = getObjectProperty(this.timeSeries, tsType, {});
    Object.keys(allTS).forEach((tsName) => {
      this.slideTimeSeries(currentDate, tsType, tsName);
    });
  }
  slideTimeSeries(currentDate, tsType, tsName) {
    const refDate = this.getTimeSerieMetadata(
      tsType,
      tsName,
      "refDate" /* refDate */,
      0
    );
    const span = this.getTimeSerieSpan(tsType, tsName);
    if (refDate === 0) {
      this.setTimeSerieMetadata(
        tsType,
        tsName,
        "refDate" /* refDate */,
        currentDate + span
      );
    } else if (currentDate - refDate >= 0) {
      const nbucket = Math.ceil((currentDate - refDate) / span);
      const allTS = getObjectProperty(this.timeSeries, tsType, {});
      Object.values(allTS).forEach((list) => {
        for (let i = 0; i < nbucket; i++) {
          list.unshift(0);
          list.pop();
        }
      });
      this.setTimeSerieMetadata(
        tsType,
        tsName,
        "refDate" /* refDate */,
        refDate + nbucket * span
      );
    }
  }
  processTip(userName, tip) {
    const tsType = "userTips" /* userTips */;
    const span = this.getTimeSerieSpan(tsType, userName);
    const list = this.getTimeSerie(tsType, userName);
    const refDate = this.getTimeSerieMetadata(
      tsType,
      userName,
      "refDate" /* refDate */,
      0
    );
    const maxDate = this.getTimeSerieMetadata(
      tsType,
      userName,
      "maxDate" /* maxDate */,
      0
    );
    if (tip.date > maxDate) {
      const idx = Math.floor((refDate - tip.date) / span);
      list[idx] = list[idx] + tip.tokens;
      this.setTimeSerieMetadata(
        tsType,
        userName,
        "maxDate" /* maxDate */,
        tip.date
      );
    }
  }
};

// src/js/tip-management.mts
function tipUpdateStatData(ctx) {
  const { message = null, user = null, room = null, kv, tip = null } = ctx;
  const globalTipStat = GlobalStatsTimeSeries.getFromKV(ctx);
  const currentDate = Date.now();
  globalTipStat.slideAllTimeSeries(currentDate, "userTips" /* userTips */);
  const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
  const keyList = Object.keys(keysMap);
  keyList.forEach((userName) => {
    const userTipInfo = UserTipInfo.getFromKV(ctx, userName);
    let extendedTip = {};
    while (typeof (extendedTip = userTipInfo.tipList.shift()) !== "undefined") {
      globalTipStat.processTip(userName, extendedTip);
    }
    userTipInfo.storeToKV(ctx);
  });
  globalTipStat.storeToKV(ctx);
}

// src/js/app-module/UserChatInfo.mts
var UserChatInfo = class _UserChatInfo {
  userName;
  sessionID;
  key;
  pendingNotices;
  constructor(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.userName = userName;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.key = _UserChatInfo.getUserChatKey(ctx, userName);
    this.pendingNotices = [];
  }
  static getFromKV(ctx, userName) {
    const userChatInfo = new _UserChatInfo(ctx, userName);
    userChatInfo.loadFromKV(ctx);
    return userChatInfo;
  }
  static getUserChatKey(ctx, userName) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    let key = null;
    const keysMap = kv.get(KV_KEYS.userChatKeysMap, {});
    if (Object.hasOwn(keysMap, userName)) {
      key = keysMap[userName];
    } else {
      key = userName + "-" + getRandomID(4);
      keysMap[userName] = key;
      kv.set(KV_KEYS.userChatKeysMap, keysMap);
    }
    return key;
  }
  // TODO improve pending notice from string to object
  static addPendingNotice(ctx, userName, futureNotice) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const userChatInfo = _UserChatInfo.getFromKV(ctx, userName);
    userChatInfo.addNotice(ctx, futureNotice);
    userChatInfo.storeToKV(ctx);
  }
  static sendPendingNotices(ctx, userName) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const userChatInfo = _UserChatInfo.getFromKV(ctx, userName);
    let notice = "";
    while (typeof (notice = userChatInfo.pendingNotices.shift()) !== "undefined") {
      printToUser(ctx, notice, userName, NOTICE_COLOR_THEME.userError);
    }
    userChatInfo.storeToKV(ctx);
  }
  static clearAll(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const keysMap = kv.get(KV_KEYS.userChatKeysMap, {});
    const keyList = Object.values(keysMap);
    keyList.forEach((key) => {
      kv.remove(key);
    });
    kv.remove(KV_KEYS.userChatKeysMap);
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const userChatInfo = kv.get(this.key, null);
    if (userChatInfo) {
      this.pendingNotices = userChatInfo.pendingNotices;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(this.key, this);
  }
  addNotice(ctx, futureNotice) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    this.pendingNotices.push(futureNotice);
  }
};

// src/js/tool/log.mts
function logIt(message) {
  const stack = new Error().stack;
  const caller = stack.split("\n")[2].trim().split(/\s+/)[1];
  if (typeof message === "object") {
    console.log(message);
    console.log("Caller ----> " + caller);
  } else {
    console.log(message + "\nCaller ----> " + caller);
  }
}

// src/js/session-management.mts
function sessionManageEnter(ctx, force = false) {
  const { user = null, room = null, kv } = ctx;
  const currentDate = Date.now();
  const lastStart = kv.get(KV_KEYS.sessionStartDate, 0);
  const lastEnter = kv.get(KV_KEYS.sessionLastEnterDate, 0);
  const lastLeave = kv.get(KV_KEYS.sessionLastLeaveDate, 0);
  const minTimeBetweenSession = SETTINGS.sessionMinTimeBetweenSession * 60 * 1e3;
  const maxTimeToRejoin = SETTINGS.sessionMaxTimeToRejoin * 60 * 1e3;
  const maxSessionLength = SETTINGS.sessionMaxSessionLength * 60 * 1e3;
  function createNewSession(first) {
    const sObj = kv.get(KV_KEYS.currentSession, null);
    if (sObj) {
      tipUpdateStatData(ctx);
    }
    UserTipInfo.clearAll(ctx);
    UserChatInfo.clearAll(ctx);
    Session.initNewSession(ctx, currentDate, first);
    GlobalStatsTimeSeries.initNewStatObj(ctx);
    const manager = CallbacksManager.initNewManager(ctx);
    manager.createAllDefaults(ctx);
    manager.storeToKV(ctx);
  }
  let keepSession = 0;
  let newSession = 0;
  let info = "";
  if (lastStart && lastEnter) {
    if (currentDate - lastLeave < maxTimeToRejoin) {
      keepSession = keepSession + 1;
      info = info + "A";
    }
    if (currentDate - lastEnter < maxTimeToRejoin + maxSessionLength) {
      keepSession = keepSession + 1;
      info = info + "B";
    }
    if (currentDate - lastStart < maxTimeToRejoin + maxSessionLength) {
      keepSession = keepSession + 1;
      info = info + "C";
    }
    if (currentDate - lastLeave > minTimeBetweenSession) {
      newSession = newSession + 1;
      info = info + "G";
    }
    if (currentDate - lastEnter > minTimeBetweenSession + maxSessionLength) {
      newSession = newSession + 1;
      info = info + "H";
    }
    if (currentDate - lastStart > minTimeBetweenSession + maxSessionLength) {
      newSession = newSession + 1;
      info = info + "I";
    }
    if (newSession > keepSession || force) {
      printToOwner(ctx, "Will create a new session. " + keepSession + newSession + info);
      createNewSession(false);
    } else {
      printToOwner(ctx, "Keeping existing session from: " + new Date(lastStart).toString());
    }
  } else {
    printToOwner(ctx, "Hello, you are new user :-)");
    createNewSession(true);
  }
  kv.set(KV_KEYS.sessionLastEnterDate, currentDate);
}
function sessionManageLeave(ctx) {
  const { user = null, room = null, kv } = ctx;
  const currentDate = Date.now();
  kv.set(KV_KEYS.sessionLastLeaveDate, currentDate);
}
var Session = class _Session {
  sessionID;
  startDate;
  constructor(currentDate) {
    this.sessionID = getRandomID(8);
    this.startDate = currentDate;
  }
  static getCurrentSession(ctx) {
    const { user = null, room = null, kv } = ctx;
    let sObj = kv.get(KV_KEYS.currentSession);
    if (!sObj) {
      sessionManageEnter(ctx);
      sObj = kv.get(KV_KEYS.currentSession);
    }
    return sObj;
  }
  static initNewSession(ctx, currentDate = null, first = false) {
    const { user = null, room = null, kv } = ctx;
    let startDate = currentDate;
    if (!startDate) {
      startDate = Date.now();
    }
    if (first) {
      logIt("First session");
      kv.set(KV_KEYS.sessionStartDate, startDate);
      kv.set(KV_KEYS.sessionLastEnterDate, startDate);
      kv.set(KV_KEYS.sessionLastLeaveDate, 0);
    } else {
      kv.set(KV_KEYS.sessionStartDate, startDate);
    }
    const previousSession = kv.get(KV_KEYS.currentSession, null);
    const newSession = new _Session(startDate);
    kv.set(KV_KEYS.currentSession, newSession);
    if (previousSession) {
      const tl = kv.get(KV_KEYS.sessionHistory, []);
      const count = tl.unshift(newSession);
      if (count > SETTINGS.sessionHistoryMaxLength) {
        tl.pop();
      }
      kv.set(KV_KEYS.sessionHistory, tl);
    }
    printToOwner(ctx, "New Session created :-)");
  }
  static clear(ctx) {
    const { user = null, room = null, kv } = ctx;
    kv.remove(KV_KEYS.sessionStartDate);
    kv.remove(KV_KEYS.sessionLastEnterDate);
    kv.remove(KV_KEYS.sessionLastLeaveDate);
    kv.remove(KV_KEYS.currentSession);
  }
};

// src/js/app-module/CallbacksManager.mts
var CALLBACKS_INFO = {
  tipUpdateStatData: {
    enabled: true,
    func: tipUpdateStatData,
    defaultDelay: 5,
    defaultRepeating: true
  }
};
var CallbacksManager = class _CallbacksManager {
  sessionID;
  activeCallbacks;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.activeCallbacks = {};
  }
  static getFromKV(ctx) {
    const manager = new _CallbacksManager(ctx);
    manager.loadFromKV(ctx);
    return manager;
  }
  static initNewManager(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const oldManager = this.getFromKV(ctx);
    oldManager.cancelAll(ctx);
    kv.remove(KV_KEYS.callbacksManager);
    const newManager = new _CallbacksManager(ctx);
    newManager.storeToKV(ctx);
    return newManager;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const manager = kv.get(KV_KEYS.callbacksManager, null);
    if (manager) {
      this.activeCallbacks = manager.activeCallbacks;
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    kv.set(KV_KEYS.callbacksManager, this);
  }
  createAllDefaults(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    Object.keys(CALLBACKS_INFO).forEach((label) => {
      const cInfo = CALLBACKS_INFO[label];
      if (cInfo.enabled) {
        this.create(
          ctx,
          label,
          cInfo.defaultDelay,
          cInfo.defaultRepeating,
          null
        );
      }
    });
  }
  create(ctx, label, delay = null, repeating = null, copyFrom = null) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    let cInfo = null;
    let baseCallback = null;
    if (copyFrom) {
      cInfo = getObjectProperty(CALLBACKS_INFO, copyFrom, null);
      baseCallback = copyFrom;
    } else {
      cInfo = getObjectProperty(CALLBACKS_INFO, label, null);
      baseCallback = label;
    }
    if (cInfo) {
      const d = delay ? delay : cInfo.defaultDelay;
      const r = repeating != null ? repeating : cInfo.defaultRepeating;
      callback.create(label, d, r);
      this.activeCallbacks[label] = {
        label,
        baseCallback,
        defaultDelay: d,
        defaultRepeating: r
      };
    }
  }
  cancel(ctx, label) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    callback.cancel(label);
    delete this.activeCallbacks[label];
  }
  cancelAll(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    Object.keys(this.activeCallbacks).forEach((label) => {
      this.cancel(ctx, label);
    });
  }
  onEvent(ctx) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    const label = callback.label;
    const aInfo = getObjectProperty(this.activeCallbacks, label, null);
    if (aInfo) {
      const bInfo = getObjectProperty(CALLBACKS_INFO, aInfo.baseCallback, null);
      if (bInfo && bInfo.func) {
        logIt(aInfo);
        if (!aInfo.defaultRepeating) {
          delete this.activeCallbacks[label];
          this.storeToKV(ctx);
        }
        bInfo.func(ctx);
      }
    }
  }
};

// src/js/app-module/ModuleBase.mts
var ModuleBase = class {
  sessionID;
  data;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // ['constructor']: typeof ModuleBase;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.data = {};
  }
  static PERSIST_PROPERTIES = ["data"];
  static NAMES_IN_SETTINGS = null;
  static CALLBACK_NAME = null;
  static SETTING_BASENAME = null;
  static CALLBACK_TEMPLATE = null;
  static SETTINGS_INFO = null;
  static getFromKV(ctx, classClass = this) {
    const module = new classClass(ctx);
    module.loadFromKV(ctx);
    return module;
  }
  static getSettingName(settingName, name) {
    return this.SETTING_BASENAME + "__" + settingName + "__" + name;
  }
  static extendSettings() {
    if (this.NAMES_IN_SETTINGS && this.SETTING_BASENAME && this.SETTINGS_INFO) {
      this.NAMES_IN_SETTINGS.forEach((name) => {
        Object.entries(this.SETTINGS_INFO).forEach(([settingName, sInfo]) => {
          const newName = this.getSettingName(settingName, name);
          const newObj = {
            ...sInfo
          };
          SETTINGS_INFO[newName] = newObj;
        });
      });
    }
  }
  static extendCallback() {
    if (this.CALLBACK_NAME && this.CALLBACK_TEMPLATE) {
      CALLBACKS_INFO[this.CALLBACK_NAME] = this.CALLBACK_TEMPLATE;
    }
  }
  static getStaticSettings() {
    const staticSettings = {};
    let settingObj = {};
    this.NAMES_IN_SETTINGS.forEach((name) => {
      settingObj = { name };
      Object.entries(this.SETTINGS_INFO).forEach(([sName]) => {
        const settingName = this.getSettingName(sName, name);
        settingObj[sName] = SETTINGS[settingName];
      });
      staticSettings[name] = settingObj;
    });
    return staticSettings;
  }
  getKVKey() {
    return this.constructor.name;
  }
  loadFromKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const kvKey = this.getKVKey();
    if (this.constructor.PERSIST_PROPERTIES) {
      const module = kv.get(kvKey, null);
      if (module) {
        this.constructor.PERSIST_PROPERTIES.forEach((propName) => {
          this[propName] = module[propName];
        });
      }
    }
  }
  storeToKV(ctx) {
    const { message = null, user = null, room = null, kv, tip = null } = ctx;
    const kvKey = this.getKVKey();
    kv.set(kvKey, this);
  }
};

// src/js/app-module/ModuleTimer.mts
var ModuleTimer = class _ModuleTimer extends ModuleBase {
  liveTimers;
  activeTimers;
  activeCallbacks;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    super(ctx);
    this.liveTimers = {};
    this.activeTimers = {};
    this.activeCallbacks = {};
  }
  static PERSIST_PROPERTIES = ["liveTimers", "activeTimers", "activeCallbacks"];
  static NAMES_IN_SETTINGS = ["A", "B", "C"];
  static CALLBACK_NAME = "timerTemplate";
  static SETTING_BASENAME = "timer";
  static CALLBACK_TEMPLATE = {
    enabled: false,
    func: this.callback,
    defaultDelay: 3600,
    defaultRepeating: false
  };
  static SETTINGS_INFO = {
    length: { defaultValue: 60, fromSettings: true, liveUpdate: false, desc: "timer length in seconds" },
    message: { defaultValue: "Are you READY ?", fromSettings: true, liveUpdate: false, desc: "timer message" },
    repeating: { defaultValue: false, fromSettings: true, liveUpdate: false, desc: "timer is repeating" }
  };
  static callback(ctx) {
    const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
    const moduleTimer = _ModuleTimer.getFromKV(ctx);
    moduleTimer._callback(ctx);
    moduleTimer.storeToKV(ctx);
  }
  _callback(ctx) {
    const { callback, user = null, room = null, kv = null, tip = null } = ctx;
    const callbackLabel = callback.label;
    const timerName = getObjectProperty(this.activeCallbacks, callbackLabel, null, false);
    if (timerName) {
      const timerStatus = getObjectProperty(this.activeTimers, timerName, null, false);
      if (timerStatus) {
        printToEveryone(ctx, timerStatus.timerMessage, NOTICE_COLOR_THEME.timer);
        if (timerStatus.repeating) {
          timerStatus.lastStartTime = Date.now();
        } else {
          this.stopTimer(ctx, timerName);
        }
      } else {
        logIt("TIMER: Timer not found: " + timerName);
      }
    } else {
      logIt("TIMER: Callback not found: " + callbackLabel);
    }
  }
  addLiveTimer(ctx, name, length, message = null, repeating = false) {
    const timer = {
      name,
      length,
      message,
      repeating
    };
    this.liveTimers[name] = timer;
    return {
      status: "created" /* created */,
      timerInfo: timer
    };
  }
  deleteLiveTimer(ctx, name) {
    this.stopTimer(ctx, name);
    delete this.liveTimers[name];
    return { status: "deleted" /* deleted */ };
  }
  startTimer(ctx, name) {
    const availlableTimers = this.getAvaillableTimers();
    const timer = getObjectProperty(availlableTimers, name, null, false);
    if (timer) {
      const oldStatus = getObjectProperty(this.activeTimers, name, null, false);
      if (oldStatus && oldStatus.state === "running" /* running */) {
        return oldStatus.state;
      }
      let newStatus = null;
      let callbackLabel = null;
      let length = null;
      let repeating = null;
      let startCallback = false;
      if (oldStatus && oldStatus.state === "frozen" /* frozen */) {
        newStatus = oldStatus;
        callbackLabel = oldStatus.callbackLabel;
        repeating = oldStatus.repeating;
        length = oldStatus.remainingLength;
        oldStatus.timerLength = length;
        startCallback = true;
      } else if (!oldStatus) {
        callbackLabel = this.constructor.CALLBACK_NAME + "__" + name;
        length = timer.length;
        repeating = timer.repeating;
        newStatus = {
          timerName: name,
          timerMessage: timer.message,
          timerLength: length,
          callbackLabel,
          repeating,
          startTime: Date.now(),
          lastStartTime: null,
          state: null
        };
        startCallback = true;
      }
      if (startCallback) {
        newStatus.lastStartTime = Date.now();
        newStatus.state = "running" /* running */;
        const callbacksManager = CallbacksManager.getFromKV(ctx);
        callbacksManager.create(
          ctx,
          callbackLabel,
          length,
          repeating,
          this.constructor.CALLBACK_NAME
        );
        this.activeTimers[name] = newStatus;
        this.activeCallbacks[callbackLabel] = name;
        callbacksManager.storeToKV(ctx);
        return { status: "running" /* running */ };
      }
      return { status: "unknown" /* unknown */ };
    } else {
      return { status: "unknown" /* unknown */ };
    }
  }
  freezeTimer(ctx, name) {
    const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
    if (timerStatus) {
      const callbacksManager = CallbacksManager.getFromKV(ctx);
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      timerStatus.state = "frozen" /* frozen */;
      if (timerStatus.repeating) {
        timerStatus.remainingLength = timerStatus.timerLength;
      } else {
        timerStatus.remainingLength = timerStatus.timerLength - Math.round((Date.now() - timerStatus.lastStartTime) / 1e3);
      }
      this.activeTimers[name] = timerStatus;
      callbacksManager.storeToKV(ctx);
      return { status: "frozen" /* frozen */ };
    } else {
      return { status: "unknown" /* unknown */ };
    }
  }
  stopTimer(ctx, name) {
    const timerStatus = getObjectProperty(this.activeTimers, name, null, false);
    if (timerStatus) {
      const callbacksManager = CallbacksManager.getFromKV(ctx);
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      delete this.activeTimers[name];
      callbacksManager.storeToKV(ctx);
      return { status: "justStoped" /* justStoped */ };
    } else {
      return { status: "unknown" /* unknown */ };
    }
  }
  stopAllTimer(ctx) {
    const callbacksManager = CallbacksManager.getFromKV(ctx);
    Object.values(this.activeTimers).forEach((timerStatus) => {
      callbacksManager.cancel(ctx, timerStatus.callbackLabel);
      delete this.activeCallbacks[timerStatus.callbackLabel];
      delete this.activeTimers[timerStatus.timerName];
    });
    callbacksManager.storeToKV(ctx);
  }
  getStatus() {
    const availlableTimers = this.getAvaillableTimers();
    Object.entries(availlableTimers).forEach(([tName, tInfo]) => {
      if (Object.hasOwn(this.activeTimers, tName)) {
        const tStatus = this.activeTimers[tName];
        const newInfo = {
          ...tInfo,
          ...tStatus
        };
        availlableTimers[tName] = newInfo;
      }
    });
    return availlableTimers;
  }
  getAvaillableTimers() {
    const staticTimers = this.constructor.getStaticSettings();
    const timers = {
      ...staticTimers,
      ...this.liveTimers
    };
    return timers;
  }
};

// src/js/user-management.mts
var DEFAULT_USER_RIGHTS = {
  guru: 4294967295,
  debug: 2 /* debugShow */ | 4 /* debugChange */,
  owner: 8 /* settingsShow */ | 16 /* settingsSet */ | 32 /* statShow */ | 64 /* timerAdmin */ | 128 /* timerShow */ | 256 /* cowsay */,
  admin: 8 /* settingsShow */ | 16 /* settingsSet */ | 32 /* statShow */ | 64 /* timerAdmin */ | 128 /* timerShow */ | 256 /* cowsay */,
  monitor: 8 /* settingsShow */ | 128 /* timerShow */ | 256 /* cowsay */,
  user: 256 /* cowsay */
};
function getUserCapabilities(userObj) {
  const username = userObj.username;
  let capabilities = 0;
  if (SETTINGS.debugEnableRemoteUser && SETTINGS.debugAllowedUsernames && Array.isArray(SETTINGS.debugAllowedUsernames) && username && SETTINGS.debugAllowedUsernames.includes(username)) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.debug;
  }
  if (userObj.colorGroup === CB_USER_GROUPS.owner.userColor || userObj.isOwner) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.owner;
    if (SETTINGS.debugAllowOwner) {
      capabilities = capabilities | DEFAULT_USER_RIGHTS.debug;
    }
  }
  if (SETTINGS.userStaffMembersAdmin && Array.isArray(SETTINGS.userStaffMembersAdmin) && username && SETTINGS.userStaffMembersAdmin.includes(username)) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.admin;
  }
  if (SETTINGS.userStaffMembersMonitor && Array.isArray(SETTINGS.userStaffMembersMonitor) && username && SETTINGS.userStaffMembersMonitor.includes(username)) {
    capabilities = capabilities | DEFAULT_USER_RIGHTS.monitor;
  }
  capabilities = capabilities | DEFAULT_USER_RIGHTS.user;
  return capabilities;
}

// src/js/command/command-debug.mts
var AVAILABLE_STAFF_COMMANDS = [
  {
    name: "debug",
    subCommand: "clearKV",
    capabilities: 4 /* debugChange */,
    func: debugClearKV,
    help: "clearing KV or removing KV entry"
  },
  {
    name: "debug",
    subCommand: "printKV",
    capabilities: 2 /* debugShow */,
    func: debugPrintKV,
    help: "printing some KV content for dev/debug"
  },
  {
    name: "debug",
    subCommand: "sessionClear",
    capabilities: 4 /* debugChange */,
    func: debugSessionClear,
    help: "clear current session data"
  },
  {
    name: "debug",
    subCommand: "sessionInit",
    capabilities: 4 /* debugChange */,
    func: debugSessionInit,
    help: "init a new session"
  },
  {
    name: "debug",
    subCommand: "sessionEnter",
    capabilities: 4 /* debugChange */,
    func: debugSessionEnter,
    help: "Call sessionEnter handler"
  },
  {
    name: "debug",
    subCommand: "sessionLeave",
    capabilities: 4 /* debugChange */,
    func: debugSessionLeave,
    help: "Call sessionLeave handler"
  },
  {
    name: "debug",
    subCommand: "callbackEnable",
    capabilities: 4 /* debugChange */,
    func: debugEnableCallbacks,
    help: "enable default callback"
  },
  {
    name: "debug",
    subCommand: "callbackCancel",
    capabilities: 4 /* debugChange */,
    func: debugCancelCallbacks,
    help: "cancel all callback"
  },
  {
    name: "debug",
    subCommand: "printTips",
    capabilities: 2 /* debugShow */,
    func: debugPrintTips,
    help: "printing user tips info for dev/debug"
  },
  {
    name: "debug",
    subCommand: "clearTips",
    capabilities: 4 /* debugChange */,
    func: debugClearTips,
    help: "clear user tips info"
  },
  {
    name: "debug",
    subCommand: "processTips",
    capabilities: 4 /* debugChange */,
    func: debugProcessTips,
    help: "process user tipsinfo and update stats"
  },
  {
    name: "debug",
    subCommand: "statsClear",
    capabilities: 4 /* debugChange */,
    func: debugClearStats,
    help: "clear Stats"
  },
  {
    name: "debug",
    subCommand: "statsPrint",
    capabilities: 4 /* debugChange */,
    func: debugPrintStats,
    help: "printing Stats"
  }
];
function init() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS);
}
function debugClearKV(ctx, args) {
  const { message = null, user = null, room = null, kv } = ctx;
  if (args && args.length === 1) {
    const key = args[0];
    kv.remove(key);
  } else {
    kv.clear();
  }
}
function debugPrintKV(ctx) {
  const { message = null, user = null, room = null, kv } = ctx;
  let v = null;
  let m = "";
  Object.values(KV_KEYS).forEach((key) => {
    try {
      v = kv.get(key);
      m = key + ": " + JSON.stringify(v, null, "	");
      printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
    } catch (ReferenceError2) {
      logIt("unknown key: " + key);
    }
  });
}
function debugSessionInit(ctx) {
  Session.initNewSession(ctx);
}
function debugSessionEnter(ctx) {
  sessionManageEnter(ctx, true);
}
function debugSessionLeave(ctx) {
  sessionManageLeave(ctx);
}
function debugSessionClear(ctx) {
  Session.clear(ctx);
}
function debugEnableCallbacks(ctx) {
  const manager = CallbacksManager.getFromKV(ctx);
  manager.createAllDefaults(ctx);
  manager.storeToKV(ctx);
}
function debugCancelCallbacks(ctx) {
  const manager = CallbacksManager.getFromKV(ctx);
  manager.cancelAll(ctx);
  manager.storeToKV(ctx);
}
function debugPrintTips(ctx) {
  const { message = null, user = null, room = null, kv, tip = null } = ctx;
  const keysMap = kv.get(KV_KEYS.userTipsKeysMap, {});
  const keyList = Object.keys(keysMap);
  const l = [];
  keyList.forEach((userName) => {
    const userTipInfo = UserTipInfo.getFromKV(ctx, userName);
    l.push(userTipInfo.toString());
  });
  const m = l.join("\n");
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}
function debugProcessTips(ctx) {
  tipUpdateStatData(ctx);
}
function debugClearTips(ctx) {
  UserTipInfo.clearAll(ctx);
}
function debugClearStats(ctx) {
  const { message = null, user = null, room = null, kv, tip = null } = ctx;
  kv.remove(KV_KEYS.currentGlobalStatsTS);
}
function debugPrintStats(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  const stat = GlobalStatsTimeSeries.getFromKV(ctx);
  logIt("Stats are");
  console.log(stat);
}

// src/js/command/command-help.mts
var LOCAL_AVAILABLE_STAFF_COMMANDS = [
  { name: "help", capabilities: 0, func: cliHelpShowHelp, help: "Need Help ?" }
];
var LOCAL_AVAILABLE_USER_COMMANDS = [
  { name: "help", capabilities: 0, func: cliHelpShowHelp, help: "Need Help ?" }
];
function init2() {
  extendAvaillableStaffCommands(LOCAL_AVAILABLE_STAFF_COMMANDS);
  extendAvaillableUserCommands(LOCAL_AVAILABLE_USER_COMMANDS);
}
function cliHelpShowHelp(ctx) {
  const { user, message } = ctx;
  const userCap = getUserCapabilities(user);
  function loopOnAvailableCommands(availableCommands, baseCmd) {
    let message2 = "";
    const arrow = `${SPACE_NON_SECABLE}${SPACE_NON_SECABLE}\u27A1${SPACE_NON_SECABLE}${SPACE_NON_SECABLE}`;
    availableCommands.forEach((c) => {
      if ((c.capabilities & userCap) === c.capabilities) {
        if (c.subCommand === void 0) {
          message2 = `${message2} ${baseCmd} ${c.name} ${arrow} ${c.help} 
`;
        } else {
          message2 = `${message2} ${baseCmd} ${c.name} ${c.subCommand} ${arrow} ${c.help} 
`;
        }
      }
    });
    return message2;
  }
  const origBody = message.orig.trim();
  let resultMessage = "Here the commands availlable to you:\n";
  if (origBody.startsWith(SETTINGS.cliBaseStaffCommand)) {
    resultMessage = resultMessage + loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS2, SETTINGS.cliBaseStaffCommand);
  } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand)) {
    resultMessage = resultMessage + loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, SETTINGS.cliBaseUserCommand);
  } else {
    resultMessage = resultMessage + "No luck, No commands for you";
  }
  printCommandResult(ctx, resultMessage, NOTICE_COLOR_THEME.help);
}

// src/js/command/command-setting.mts
var AVAILABLE_STAFF_COMMANDS3 = [
  {
    name: "settings",
    subCommand: "show",
    capabilities: 8 /* settingsShow */,
    func: cliSettingShowSettings,
    help: "showing current settings"
  },
  {
    name: "settings",
    subCommand: "showlive",
    capabilities: 8 /* settingsShow */,
    func: cliSettingShowLiveSettings,
    help: "showing overriding settings, stored in KV"
  },
  {
    name: "settings",
    subCommand: "setlive",
    capabilities: 16 /* settingsSet */,
    func: cliSettingSetLiveSetting,
    help: "override a setting"
  },
  {
    name: "settings",
    subCommand: "clearlive",
    capabilities: 16 /* settingsSet */,
    func: cliSettingClearLiveSetting,
    help: "clear an overrided setting"
  },
  {
    name: "settings",
    subCommand: "clearliveall",
    capabilities: 16 /* settingsSet */,
    func: cliSettingClearAllLiveSettings,
    help: "clear all overrided settings"
  }
];
function init3() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS3);
}
function cliSettingShowSettings(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  printCommandResult(ctx, JSON.stringify(SETTINGS, null, "	"), NOTICE_COLOR_THEME.staff);
}
function cliSettingSetLiveSetting(ctx, args) {
  const { message = null, user = null, room = null, kv } = ctx;
  if (args.length > 1) {
    const key = args[0];
    const v = args[1];
    if (Object.hasOwn(SETTINGS_INFO, key)) {
      const sInfo = SETTINGS_INFO[key];
      const { defaultValue = null, liveUpdate = null, convert = null } = sInfo;
      if (liveUpdate) {
        let settings = {};
        settings = kv.get(KV_KEYS.liveSettings, {});
        if (convert && v) {
          let c = null;
          let l = null;
          let nv = null;
          switch (convert) {
            case SETTINGS_CONVERT.number:
              c = parseInt(v);
              if (typeof c === "number" && c) {
                settings[key] = c;
              } else {
                settings[key] = defaultValue;
              }
              break;
            case SETTINGS_CONVERT.listString:
              l = v.split(CB_SETTINGS_LIST_SEPARATOR);
              nv = [];
              l.forEach((u) => {
                nv.push(u.trim());
              });
              settings[key] = nv;
              break;
            case SETTINGS_CONVERT.boolean:
              c = parseInt(v);
              if (v === "true") {
                settings[key] = true;
              } else if (v === "false") {
                settings[key] = false;
              } else {
                settings[key] = defaultValue;
              }
              break;
            default:
              settings[key] = v;
              break;
          }
        } else {
          settings[key] = v;
        }
        kv.set(KV_KEYS.liveSettings, settings);
      }
    }
  }
}
function cliSettingClearLiveSetting(ctx, args) {
  const { message = null, user = null, room = null, kv } = ctx;
  if (args.length === 1) {
    const key = args[0];
    if (Object.hasOwn(SETTINGS_INFO, key)) {
      const sInfo = SETTINGS_INFO[key];
      const { liveUpdate = null } = sInfo;
      if (liveUpdate) {
        let settings = {};
        settings = kv.get(KV_KEYS.liveSettings, {});
        delete settings[key];
        kv.set(KV_KEYS.liveSettings, settings);
      }
    }
  }
}
function cliSettingClearAllLiveSettings(ctx) {
  const { message = null, user = null, room = null, kv } = ctx;
  const settings = {};
  kv.set(KV_KEYS.liveSettings, settings);
}
function cliSettingShowLiveSettings(ctx) {
  const { message = null, user = null, room = null, kv } = ctx;
  const settings = kv.get(KV_KEYS.liveSettings, {});
  printCommandResult(ctx, JSON.stringify(settings, null, "	"), NOTICE_COLOR_THEME.staff);
}

// src/js/app-module/GlobalStatsCompute.mts
var GlobalStatsCompute = class {
  sessionID;
  globalStatsTS;
  constructor(ctx) {
    const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
    const sObj = Session.getCurrentSession(ctx);
    this.sessionID = sObj.sessionID;
    this.globalStatsTS = GlobalStatsTimeSeries.getFromKV(ctx);
  }
  static TIME_RANGE = {
    ALL: 0,
    min5: 5 * 60 * 1e3,
    min15: 15 * 60 * 1e3
  };
  getTipSum(tsType, tsName, period) {
    const list = this.globalStatsTS.getTimeSerie(tsType, tsName);
    const span = this.globalStatsTS.getTimeSerieSpan(tsType, tsName);
    const currentDate = Date.now();
    const refDate = this.globalStatsTS.getTimeSerieMetadata(
      tsType,
      tsName,
      "refDate" /* refDate */,
      0
    );
    let sum = 0;
    if (refDate <= currentDate) {
      this.globalStatsTS.slideAllTimeSeries(currentDate, tsType);
    }
    if (period >= span) {
      const idxStart = Math.floor((refDate - currentDate) / span);
      const idxEnd = idxStart + Math.floor(period / span);
      for (let index = idxStart; index < idxEnd; index++) {
        sum = sum + list[index];
      }
    }
    return sum;
  }
  getMaxTipper(period) {
    const tsType = "userTips" /* userTips */;
    const userNames = this.globalStatsTS.getTimeSerieNames(tsType);
    let max = 0;
    let uName = null;
    userNames.forEach((tsName) => {
      const sum = this.getTipSum(tsType, tsName, period);
      if (sum > max) {
        max = sum;
        uName = tsName;
      }
    });
    return { userName: uName, tokens: max };
  }
  getTotalTips(period, minTipsToAccount = 0) {
    const tsType = "userTips" /* userTips */;
    const userNames = this.globalStatsTS.getTimeSerieNames(tsType);
    let total = 0;
    let userCount = 0;
    userNames.forEach((tsName) => {
      const sum = this.getTipSum(tsType, tsName, period);
      if (sum > minTipsToAccount) {
        total = total + sum;
        userCount = userCount + 1;
      }
    });
    return { tokens: total, userCount };
  }
  getSessionTotalTips(ctx) {
    const tsType = "userTips" /* userTips */;
    const userNames = this.globalStatsTS.getTimeSerieNames(tsType);
    let total = 0;
    let userCount = 0;
    userNames.forEach((tsName) => {
      const tipInfo = UserTipInfo.getFromKV(ctx, tsName);
      if (tipInfo.tipTotal > 0) {
        total = total + tipInfo.tipTotal;
        userCount = userCount + 1;
      }
    });
    return { tokens: total, userCount };
  }
};

// src/js/command/command-stat.mts
var AVAILABLE_STAFF_COMMANDS4 = [
  {
    name: "stat",
    subCommand: "showTips",
    capabilities: 32 /* statShow */,
    func: cliStatShowTipStats,
    help: "show Stats about tips"
  }
];
function init4() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS4);
}
function cliStatShowTipStats(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const statCompute = new GlobalStatsCompute(ctx);
  const p5min = 5 * 60 * 1e3;
  const bt5min = statCompute.getMaxTipper(p5min);
  const tot5min0tk = statCompute.getTotalTips(p5min, 0);
  const tot5min5tk = statCompute.getTotalTips(p5min, 5);
  const totSession = statCompute.getSessionTotalTips(ctx);
  const msg = `Some Stats:
    - Best Tipper in last 5 minutes: ${bt5min.userName} (${bt5min.tokens} tokens)
    - Total Tips  in last 5 minutes:     ${tot5min0tk.tokens} (${tot5min0tk.userCount} users)
    - Total Big Tips  in last 5 minutes: ${tot5min5tk.tokens} (${tot5min5tk.userCount} users)
    - Total Tips in current Session: ${totSession.tokens} (${totSession.userCount} users)`;
  printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}

// src/js/command/command-test.mts
var import_cowsayjs = __toESM(require_lib(), 1);
var AVAILABLE_STAFF_COMMANDS5 = [
  {
    name: "test",
    subCommand: "perfkv",
    capabilities: 4 /* debugChange */,
    func: testPerfKV,
    help: "some KV perf testing"
  },
  {
    name: "test",
    subCommand: "getID",
    capabilities: 4 /* debugChange */,
    func: testRandomID,
    help: "testing ID generation"
  },
  {
    name: "test",
    subCommand: "cowsay",
    capabilities: 4 /* debugChange */,
    func: testCowsay,
    help: "testing cowsay"
  }
  // { name: 'test', subCommand: 'testExtend', capabilities: CAPABILITY.debugChange, 
  // func: testExtendClass, help: 'test JS extend classes' },
];
var AVAILABLE_USER_COMMANDS2 = [
  {
    name: "test",
    subCommand: "testForEveryone",
    capabilities: 0,
    func: testSimpleCommand,
    help: "Want to test an app command ?"
  }
];
function init5() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS5);
  extendAvaillableUserCommands(AVAILABLE_USER_COMMANDS2);
}
function testCowsay(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  const output = (0, import_cowsayjs.cowsay)("Hello from typescript!");
  console.log(output);
  printCommandResult(ctx, output.replaceAll(" ", "\xA0"), NOTICE_COLOR_THEME.staff);
}
function testRandomID(ctx) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  let m = getRandomID();
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
  m = getRandomID(4);
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
  m = getRandomID(8);
  printCommandResult(ctx, m, NOTICE_COLOR_THEME.staff);
}
function testSimpleCommand(ctx) {
  printCommandResult(ctx, "Good you can run a command :-)", NOTICE_COLOR_THEME.help);
}
function testPerfKV(ctx) {
  const { message, user = null, room = null, kv } = ctx;
  logIt("testing KV perf");
  const origBody = message.orig.trim().toLowerCase();
  const elements = origBody.split(" ");
  const action = elements[3];
  if ("init" === action) {
    const toto = { tete: 0, l: [] };
    kv.set("toto", toto);
  } else if ("display" === action) {
    const t = kv.get("toto", {});
    logIt(t.tete);
    let s = 0;
    t.l.forEach((e) => {
      s = s + e;
    });
    logIt(s);
  } else {
    const iter = parseInt(action);
    let t = {};
    t = kv.get("toto", {});
    for (let index = 0; index < iter; index++) {
      t = kv.get("toto", {});
      t.tete = t.tete + 1;
      t.l.push(t.tete);
      kv.set("toto", t);
    }
  }
}

// src/js/command/command-timer.mts
var AVAILABLE_STAFF_COMMANDS6 = [
  {
    name: "timer",
    subCommand: "start",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerStart,
    help: "Start timer"
  },
  {
    name: "timer",
    subCommand: "stop",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerStop,
    help: "Stop timer"
  },
  {
    name: "timer",
    subCommand: "stopall",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerStopAll,
    help: "Stop All timers"
  },
  {
    name: "timer",
    subCommand: "freeze",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerFreeze,
    help: "Freeze timer"
  },
  {
    name: "timer",
    subCommand: "list",
    capabilities: 128 /* timerShow */,
    func: cliTimerListTimers,
    help: "List timers"
  },
  {
    name: "timer",
    subCommand: "add",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerAddTimer,
    help: "Add a timer"
  },
  {
    name: "timer",
    subCommand: "delete",
    capabilities: 64 /* timerAdmin */,
    func: cliTimerdeleteTimer,
    help: "delete a timer"
  }
];
function init6() {
  extendAvaillableStaffCommands(AVAILABLE_STAFF_COMMANDS6);
}
function cliTimerStart(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTimer.startTimer(ctx, name);
    if (result.status === "running" /* running */) {
      moduleTimer.storeToKV(ctx);
      console.log(moduleTimer);
      printCommandResult(ctx, "Timer started: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === "unknown" /* unknown */) {
      printCommandResult(ctx, "Timer unknown: " + name, NOTICE_COLOR_THEME.error);
    } else {
      printCommandResult(ctx, "Timer, unknown error: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${SETTINGS.cliBaseStaffCommand} ${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerFreeze(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTImer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTImer.freezeTimer(ctx, name);
    if (result.status === "frozen" /* frozen */) {
      moduleTImer.storeToKV(ctx);
      printCommandResult(ctx, "Timer frozen: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === "unknown" /* unknown */) {
      printCommandResult(ctx, "Timer unknown: " + name, NOTICE_COLOR_THEME.error);
    } else {
      printCommandResult(ctx, "Timer, unknown error: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerStop(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const result = moduleTimer.stopTimer(ctx, name);
    if (result.status === "justStoped" /* justStoped */) {
      moduleTimer.storeToKV(ctx);
      printCommandResult(ctx, "Timer stoped: " + name, NOTICE_COLOR_THEME.staff);
    } else if (result.status === "unknown" /* unknown */) {
      printCommandResult(ctx, "Timer unknown: " + name, NOTICE_COLOR_THEME.error);
    } else {
      printCommandResult(ctx, "Timer, unknown error: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerStopAll(ctx) {
  const moduleTImer = ModuleTimer.getFromKV(ctx);
  moduleTImer.stopAllTimer(ctx);
  moduleTImer.storeToKV(ctx);
  cliTimerListTimers(ctx);
}
function cliTimerAddTimer(ctx, args, cliInfo) {
  if (args.length >= 2) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const timerLength = parseInt(args[0]);
    const timerMessage = args.slice(1).join(" ");
    const existingNames = Object.keys(moduleTimer.getAvaillableTimers());
    let timerName = null;
    AVAILLABLE_LIVE_SETTINGS_NAMES.some((pName) => {
      if (!existingNames.includes(pName)) {
        timerName = pName;
        return true;
      }
    });
    if (timerName && timerLength) {
      const result = moduleTimer.addLiveTimer(ctx, timerName, timerLength, timerMessage, false);
      moduleTimer.storeToKV(ctx);
      const msg = `OK: timer ${result.timerInfo.name} created`;
      printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
    } else {
      let msg = "";
      if (!timerLength) {
        msg = msg + "ERROR: length not correct: " + args[0] + " \n";
      }
      if (!timerName) {
        msg = msg + "ERROR: No free timer name\n";
      }
      msg = msg + `${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <length in sec> <message>`;
      printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please enter timer infos
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <length in sec> <message>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerdeleteTimer(ctx, args, cliInfo) {
  if (args.length === 1) {
    const moduleTimer = ModuleTimer.getFromKV(ctx);
    const name = args[0];
    const existingNames = Object.keys(moduleTimer.liveTimers);
    if (existingNames.includes(name)) {
      const result = moduleTimer.deleteLiveTimer(ctx, name);
      if (result.status === "deleted" /* deleted */) {
        moduleTimer.storeToKV(ctx);
        printCommandResult(ctx, "Timer deleted: " + name, NOTICE_COLOR_THEME.staff);
      }
    } else {
      printCommandResult(ctx, "Timer not found or Static Timer: " + name, NOTICE_COLOR_THEME.error);
    }
  } else {
    const msg = `Please choose a timer
        ${COMMAND_START_CHAR}${cliInfo.commandName} ${cliInfo.subCommand} <timerName>`;
    printCommandResult(ctx, msg, NOTICE_COLOR_THEME.error);
  }
}
function cliTimerListTimers(ctx) {
  const moduleTimer = ModuleTimer.getFromKV(ctx);
  const timers = moduleTimer.getStatus();
  let msg = `Timers list:`;
  let m = "";
  console.log(timers);
  Object.entries(timers).forEach(([tName, tInfo]) => {
    if (typeof tInfo.state === "undefined") {
      m = `${tName}: ${tInfo.length}sec '${tInfo.message}'`;
    } else if (tInfo.state === "running" /* running */) {
      m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.timerLength - Math.round((Date.now() - tInfo.lastStartTime) / 1e3)}sec rem '${tInfo.message}'`;
    } else if (tInfo.state === "frozen" /* frozen */) {
      m = `${tName}: ${tInfo.length}sec ${tInfo.state} ${tInfo.remainingLength}sec remaining '${tInfo.message}'`;
    }
    msg = `${msg}
        ${m}`;
  });
  printCommandResult(ctx, msg, NOTICE_COLOR_THEME.staff);
}

// src/js/app-module/ModuleChatFilter.mts
var import_cowsayjs2 = __toESM(require_lib(), 1);
var LEET_TABLE = {
  a: ["@", "4"],
  b: ["8"],
  c: ["("],
  e: ["3"],
  g: ["6"],
  h: ["#"],
  i: ["!", "1"],
  l: ["1"],
  o: ["0"],
  s: ["$"],
  t: ["7"],
  z: ["2"]
};
function leetChar(chr) {
  let rl = [];
  if (Object.hasOwn(LEET_TABLE, chr.toLowerCase())) {
    rl.push(chr);
    rl = rl.concat(LEET_TABLE[chr.toLowerCase()]);
  } else {
    rl.push(chr);
  }
  return rl;
}
function leetString(str) {
  const rl = [];
  if (str.length > 1) {
    leetChar(str[0]).forEach((e1) => {
      leetString(str.substring(1)).forEach((e2) => {
        rl.push(e1.concat(e2));
      });
    });
  }
  if (str.length === 1) {
    leetChar(str[0]).forEach((e1) => {
      rl.push(e1);
    });
  } else {
    rl.push(str);
  }
  return rl;
}
function stringSimilarity(str1, str2, gramSize = 3) {
  function getNGrams(s, len) {
    s = " ".repeat(len - 1) + s.toLowerCase() + " ".repeat(len - 1);
    const v = new Array(s.length - len + 1);
    for (let i = 0; i < v.length; i++) {
      v[i] = s.slice(i, i + len);
    }
    return v;
  }
  if (!(str1 === null || str1 === void 0 ? void 0 : str1.length) || !(str2 === null || str2 === void 0 ? void 0 : str2.length)) {
    return 0;
  }
  const s1 = str1.length < str2.length ? str1 : str2;
  const s2 = str1.length < str2.length ? str2 : str1;
  const pairs1 = getNGrams(s1, gramSize);
  const pairs2 = getNGrams(s2, gramSize);
  const set = new Set(pairs1);
  const total = pairs2.length;
  let hits = 0;
  for (let item of pairs2) {
    if (set.delete(item)) {
      hits++;
    }
  }
  return hits * 100 / total;
}
function compareWord(word, badWord, collator, fuzzyScoreMin) {
  if (collator.compare(word, badWord) === 0) {
    return badWord;
  }
  const bwl = leetString(badWord);
  bwl.forEach((ebw) => {
    if (collator.compare(word, ebw) === 0) {
      return ebw;
    }
  });
  let found = false;
  found = bwl.some((ebw) => {
    if (collator.compare(word, ebw) === 0) {
      return ebw;
    } else {
      return false;
    }
  });
  if (found) {
    return found;
  }
  if (fuzzyScoreMin > 0) {
    if (stringSimilarity(badWord, word) > fuzzyScoreMin) {
      return badWord;
    }
    found = false;
    found = bwl.some((ebw) => {
      if (stringSimilarity(ebw, word) > fuzzyScoreMin) {
        return ebw;
      } else {
        return false;
      }
    });
    if (found) {
      return found;
    }
  }
  return false;
}
function searchBadWord(wordsList, badWordList, fuzzyScoreMin) {
  const collator = Intl.Collator("en-US", { sensitivity: "base" });
  const foundBadWords = [];
  let found = false;
  wordsList.forEach((word) => {
    found = false;
    found = badWordList.some((bw) => {
      return compareWord(word, bw, collator, fuzzyScoreMin);
    });
    if (found) {
      foundBadWords.push(word);
    }
  });
  return foundBadWords;
}
function splitMessageText(messageText) {
  let wordRegexString = "([a-zA-Z\xE0-\xFC\xC0-\xDC";
  Object.values(LEET_TABLE).forEach((l) => {
    l.forEach((c) => {
      wordRegexString = wordRegexString.concat(c);
    });
  });
  wordRegexString = wordRegexString.concat("])+");
  let wordRegex = /([a-zA-Zà-üÀ-Ü])+/g;
  wordRegex = new RegExp(wordRegexString, "g");
  const words = messageText.match(wordRegex);
  return words;
}
var ModuleChatFilter = class extends ModuleBase {
  onMessage(ctx) {
    const { message = null, user, kv = null } = ctx;
    const userName = user.username;
    UserChatInfo.sendPendingNotices(ctx, userName);
  }
  onMessageTransform(ctx) {
    const { message, user, kv = null } = ctx;
    const words = splitMessageText(message.orig);
    let newMessage = message.orig;
    let foundBadWords = [];
    const result = {
      badWords: [],
      veryBadWords: [],
      spam: false
    };
    foundBadWords = searchBadWord(words, SETTINGS.chatBadWords, SETTINGS.chatFuzzyScoreForBW);
    if (foundBadWords.length > 0) {
      foundBadWords.forEach((bw) => {
        let newWord = bw.slice(0, 1);
        newWord = newWord.padEnd(bw.length, ".");
        newMessage = newMessage.replaceAll(bw, newWord);
        message.setBody(newMessage);
        result.badWords = foundBadWords;
        result.spam = true;
      });
    }
    foundBadWords = searchBadWord(words, SETTINGS.chatVeryBadWords, SETTINGS.chatFuzzyScoreForVBW);
    if (foundBadWords.length > 0) {
      message.setSpam(true);
      const n = user.username + " " + SETTINGS.chatNoticeToUserVBW;
      UserChatInfo.addPendingNotice(ctx, user.username, n);
      result.badWords = foundBadWords;
      result.spam = true;
    }
    return result;
  }
  chatCowSay(ctx, messageText) {
    const { message } = ctx;
    let spam = false;
    if (messageText.length > 0) {
      const words = splitMessageText(messageText);
      let foundBadWords = [];
      foundBadWords = searchBadWord(words, SETTINGS.chatBadWords, SETTINGS.chatFuzzyScoreForBW);
      if (foundBadWords.length > 0) {
        spam = true;
      } else {
        foundBadWords = searchBadWord(words, SETTINGS.chatVeryBadWords, SETTINGS.chatFuzzyScoreForVBW);
        if (foundBadWords.length > 0) {
          spam = true;
        }
      }
    }
    if (!spam) {
      const newMessage = "\n" + (0, import_cowsayjs2.cowsay)(messageText, { cow: SETTINGS.cowsayCowName }).replaceAll(" ", SPACE_NON_SECABLE);
      message.setBody(newMessage);
      message.setFont("Courier" /* Courier */);
      message.setColor(SETTINGS.cowsayColor);
      message.setBgColor(SETTINGS.cowsayBgColor);
      message.setSpam(false);
    }
  }
};

// src/js/command/command-chat.mts
var AVAILABLE_USER_COMMANDS3 = [
  {
    name: "cowsay",
    capabilities: 256 /* cowsay */,
    transform: true,
    func: cliCowSay,
    help: "A cow in a chatroom..."
  }
];
function init7() {
  extendAvaillableUserCommands(AVAILABLE_USER_COMMANDS3);
}
function cliCowSay(ctx, args) {
  const { message = null, user = null, room = null, kv = null } = ctx;
  let messageText = "";
  if (args.length >= 1) {
    messageText = args.join(" ");
  }
  const chatFilter = ModuleChatFilter.getFromKV(ctx);
  chatFilter.chatCowSay(ctx, messageText);
  chatFilter.storeToKV(ctx);
}

// src/js/command/command-processor.mts
function createCommandsList() {
  init5();
  init();
  init3();
  init4();
  init6();
  init7();
  init2();
}
var AVAILABLE_STAFF_COMMANDS2 = [];
var AVAILABLE_USER_COMMANDS = [];
function extendAvaillableStaffCommands(commandList) {
  commandList.forEach((command) => {
    AVAILABLE_STAFF_COMMANDS2.push(command);
  });
}
function extendAvaillableUserCommands(commandList) {
  commandList.forEach((command) => {
    AVAILABLE_USER_COMMANDS.push(command);
  });
}
function commandProcessor(ctx, transform = false) {
  const { message, user, room = null, kv = null } = ctx;
  const userCap = getUserCapabilities(user);
  function loopOnAvailableCommands(availableCommands, origBody2) {
    const elements = origBody2.split(" ");
    const commandName = elements[1];
    const subCommand = elements[2];
    const result = {
      newMessageObj: {},
      transform: false,
      cmdFound: false
    };
    let cmdFound = false;
    availableCommands.forEach((c) => {
      if (c.name === commandName && (c.capabilities & userCap) === c.capabilities) {
        if (c.subCommand === void 0 || c.subCommand === subCommand) {
          let args = [];
          const cliInfo = {
            commandName,
            subCommand: null
          };
          if (c.subCommand === void 0) {
            args = elements.slice(2);
          } else {
            args = elements.slice(3);
            cliInfo.subCommand = c.subCommand;
          }
          cmdFound = true;
          if (c.transform === void 0 && transform === false || c.transform === transform) {
            result.newMessageObj = c.func(ctx, args, cliInfo);
            result.cmdFound = true;
            if (transform) {
              result.transform = true;
            }
            return result;
          }
        }
      }
    });
    if (!cmdFound) {
      printCommandResult(ctx, "Command not found !", NOTICE_COLOR_THEME.error);
      return result;
    }
  }
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    createCommandsList();
    if (origBody.startsWith(SETTINGS.cliBaseStaffCommand)) {
      return loopOnAvailableCommands(AVAILABLE_STAFF_COMMANDS2, origBody);
    } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand)) {
      return loopOnAvailableCommands(AVAILABLE_USER_COMMANDS, origBody);
    }
  }
}

// src/js/shared_code.mts
function onTipReceived(ctx) {
  const { message = null, user = null, room = null, kv = null, tip = null } = ctx;
  UserTipInfo.updateUserTips(ctx);
}
function onMessage(ctx) {
  const { message, user = null, room = null, kv = null } = ctx;
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    commandProcessor(ctx);
  }
  const chatFilter = ModuleChatFilter.getFromKV(ctx);
  chatFilter.onMessage(ctx);
  chatFilter.storeToKV(ctx);
}
function onMessageTransform(ctx) {
  const { message, user = null, room = null, kv = null } = ctx;
  const origBody = message.orig.trim();
  if (origBody[0] === COMMAND_START_CHAR) {
    if (origBody.startsWith(SETTINGS.cliBaseStaffCommand) && !SETTINGS.cliBroadcastStaffCmd) {
      message.setSpam(true);
    } else if (origBody.startsWith(SETTINGS.cliBaseUserCommand) && !SETTINGS.cliBroadcastUserCmd) {
      message.setSpam(true);
    }
    commandProcessor(ctx, true);
  } else {
    const chatFilter = ModuleChatFilter.getFromKV(ctx);
    chatFilter.onMessageTransform(ctx);
    chatFilter.storeToKV(ctx);
  }
}
function onAppStart(ctx) {
  const { app, user = null, room = null, kv, tip = null } = ctx;
  const sObj = kv.get(KV_KEYS.currentSession, null);
  if (!sObj) {
    sessionManageEnter(ctx);
  }
  const m = `\u26A1\uFE0F ${app.name} (v${app.version}) has started.`;
  printToOwner(ctx, m, NOTICE_COLOR_THEME.staff);
  const manager = CallbacksManager.initNewManager(ctx);
  manager.createAllDefaults(ctx);
  manager.storeToKV(ctx);
  logIt("App started");
}
function onAppStop(ctx) {
  const { app, user = null, room = null, kv = null, tip = null } = ctx;
  const m = `\u26A1\uFE0F ${app.name} has stopped`;
  printToOwner(ctx, m, NOTICE_COLOR_THEME.staff);
  logIt("App stoped");
}
function onBroadcastStart(ctx) {
  sessionManageEnter(ctx);
  logIt("Broadcast started YOOOUUUUPPPIIIII");
}
function onBroadcastStop(ctx) {
  sessionManageLeave(ctx);
  logIt("Broadcast stoped,  gniininii");
}
function onUserEnter(ctx) {
  const { message = null, user, room = null, kv = null, tip = null } = ctx;
  if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
    sessionManageEnter(ctx);
  }
}
function onUserLeave(ctx) {
  const { message = null, user, room = null, kv = null, tip = null } = ctx;
  if (user.isOwner || user.colorGroup === CB_USER_GROUPS.owner.userColor) {
    sessionManageLeave(ctx);
  }
}
function onCallback(ctx) {
  const { callback = null, user = null, room = null, kv = null, tip = null } = ctx;
  const manager = CallbacksManager.getFromKV(ctx);
  manager.onEvent(ctx);
}
function bundlerHack() {
  const CBentryPoints = [
    onAppStart,
    onAppStop,
    onBroadcastStart,
    onBroadcastStop,
    onCallback,
    onMessage,
    onMessageTransform,
    onTipReceived,
    onUserEnter,
    onUserLeave
  ];
}
bundlerHack();
ModuleTimer.extendSettings();
ModuleTimer.extendCallback();
updateSettings();
