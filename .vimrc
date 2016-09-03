sy on
set modeline
set backspace=indent,eol,start
set ts=2
set sw=2
set sts=2
set et
set nowrap
set ruler
set smartindent
set wildmode=longest,list
set wildmenu
set incsearch
set cursorline

hi CursorLine term=bold cterm=bold guibg=Grey40

au FileType javascript setlocal ts=2 sw=2 sts=2 et
au FileType yaml setlocal ts=2 sw=2 sts=2 et

