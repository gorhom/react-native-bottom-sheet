module.exports = function (Handlebars) {
  Handlebars.registerHelper('custom', function (context, extra, options) {
    if ((!context || context.length === 0) && (!extra || extra.length === 0)) {
      return '';
    }

    const list = [...context, ...extra]
      .filter(item => {
        const commit = item.commit || item;
        if (options.hash.exclude) {
          const pattern = new RegExp(options.hash.exclude, 'm');
          if (pattern.test(commit.message)) {
            return false;
          }
        }
        if (options.hash.message) {
          const pattern = new RegExp(options.hash.message, 'm');
          return pattern.test(commit.message);
        }
        if (options.hash.subject) {
          const pattern = new RegExp(options.hash.subject);
          return pattern.test(commit.subject);
        }
        return true;
      })
      .map(item => options.fn(item))
      .join('');

    if (!list) {
      return '';
    }

    return options.hash.heading
      ? `${options.hash.heading}\n\n${list}`
      : `${list}`;
  });
};
