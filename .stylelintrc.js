module.exports = {
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-lost"
  ],
  "rules": {
    "at-rule-empty-line-before": null,
    "at-rule-no-unknown": [ true, {
      ignoreAtRules: ["define-mixin", "mixin", "mixin-content", "lost"],
    }],
    "comment-whitespace-inside": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "selector-list-comma-newline-after": null,
    "indentation": null,
    "comment-empty-line-before": null,
    "color-hex-case": "upper",
    "selector-pseudo-class-no-unknown": [true, {
      "ignorePseudoClasses": ["global"]
    }],
  }
}
