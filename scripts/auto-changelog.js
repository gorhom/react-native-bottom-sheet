module.exports = function (Handlebars) {
  Handlebars.registerHelper(
    'custom',
    function (context, merges, fixes, options) {
      if (
        (!context || context.length === 0) &&
        (!merges || merges.length === 0) &&
        (!fixes || fixes.length === 0)
      ) {
        return '';
      }

      const list = [...context, ...(merges || []), ...(fixes || [])]
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
        .map(item => options.fn(item.commit || item))
        .join('');

      if (!list) {
        return '';
      }

      return options.hash.heading
        ? `${options.hash.heading}\n\n${list}`
        : `${list}`;
    }
  );
};
