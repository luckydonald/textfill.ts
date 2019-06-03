# Makefile that minifies jquery-textfill
#
# $ make          # Minifies to `jquery-textfill.min.js`
# $ make clean    # Deletes minified output
#
# Thanks to Google Closure Compiler
# http://closure-compiler.appspot.com/home

all: ../dist/textfill.min.js 
	# Done! Result on "$<"
	# Byte count:
	@cp textfill.js ../dist/textfill.js
	@wc -c ../dist/textfill.min.js ../dist/textfill.js

../dist/textfill.min.js: textfill.js
	# Minifying "$@"...
	# @curl --data output_info=compiled_code --data-urlencode js_code@textfill.js http://closure-compiler.appspot.com/compile > textfill.min.js
	@curl -s -d compilation_level=SIMPLE_OPTIMIZATIONS -d output_format=text -d output_info=compiled_code -d language=ECMASCRIPTS -d charset=utf-8 --data-urlencode "js_code@./textfill.js" https://closure-compiler.appspot.com/compile > ../dist/textfill.min.js

clean:
	# Deleted "textfill.min.js"
	@rm -f ../dist/textfill.min.js

.PHONY: clean

