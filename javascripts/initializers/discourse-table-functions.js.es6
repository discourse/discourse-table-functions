import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-table-functions",

  initialize() {
    withPluginApi("0.12.3", (api) => {
      api.decorateCookedElement(
        (post) => {
          const rows = post.getElementsByTagName("tr");

          if (rows.length === 0 || !/\=SUM/.exec(post.innerHTML)) {
            return;
          }

          let cache = {};
          Array.prototype.slice.call(rows).forEach((row) => {
            const cols = row.getElementsByTagName("td");
            Array.prototype.slice.call(cols).forEach((col, index) => {
              if (/[\d,]+/.exec(col.innerHTML)) {
                cache[index] =
                  (cache[index] || 0) +
                  parseFloat(
                    col.innerHTML
                      .split("")
                      .filter((d) => /[\d\.]/.exec(d))
                      .join("")
                  );
              }
              if (col.innerHTML === "=SUM") {
                col.innerHTML = `<strong>${cache[index]}</strong>`;
              }
            });
          });
        },
        { id: "discourse-table-functions-decorator" }
      );
    });
  },
};
