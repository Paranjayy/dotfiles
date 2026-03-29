-- LazyVim extras to enable
return {
  -- Lang extras
  { import = "lazyvim.plugins.extras.lang.typescript" },
  { import = "lazyvim.plugins.extras.lang.json" },
  { import = "lazyvim.plugins.extras.lang.python" },
  
  -- Editor extras
  { import = "lazyvim.plugins.extras.editor.telescope" },
  { import = "lazyvim.plugins.extras.editor.mini-files" },
  
  -- UI extras
  { import = "lazyvim.plugins.extras.ui.mini-starter" },
  
  -- Formatting
  { import = "lazyvim.plugins.extras.formatting.prettier" },
  
  -- Linting
  { import = "lazyvim.plugins.extras.linting.eslint" },
}
