#!/bin/bash

set -e

# Base directory for this entire project
BASEDIR=$(cd $(dirname $0) && pwd)

# Source directory for unbuilt code
SRCDIR="$BASEDIR/src"

# Directory containing dojo build utilities
TOOLSDIR="$SRCDIR/vendor/dojo/util/buildscripts"

# Destination directory for built code
DISTDIR="$BASEDIR/public"

# Module ID of the main application package loader configuration
LOADERMID="app/run"

# Main application package loader configuration
LOADERCONF="$SRCDIR/$LOADERMID.js"

# Main application package build configuration
PROFILE="$SRCDIR/app/app.profile.js"

# Configuration over. Main application start up!

if [ ! -d "$TOOLSDIR" ]; then
    echo "Can't find Dojo build tools -- did you initialise submodules? (git submodule update --init --recursive)"
    exit 1
fi

echo "Building application with $PROFILE to $DISTDIR."

echo -n "Cleaning old files..."
rm -rf "$DISTDIR"
echo " Done"

cd "$TOOLSDIR"

if which node >/dev/null; then
echo "Running Node"
node ../../dojo/dojo.js load=build --require "$LOADERCONF" --profile "$PROFILE" --releaseDir "$DISTDIR" "$@"
elif which java >/dev/null; then
echo "Running Java"
java -Xms256m -Xmx256m -cp ../shrinksafe/js.jar:../closureCompiler/compiler.jar:../shrinksafe/shrinksafe.jar org.mozilla.javascript.tools.shell.Main ../../dojo/dojo.js baseUrl=../../dojo load=build --require "$LOADERCONF" --profile "$PROFILE" --releaseDir "$DISTDIR" "$@"
else
echo "Need node.js or Java to build!"
    exit 1
fi

cd "$BASEDIR"

LOADERMID=${LOADERMID//\//\\\/}

# Copy & minify index.html to dist
cat "$SRCDIR/index.html" | tr '\n' ' ' | \
perl -pe "
  s/<\!--.*?-->//g;                          # Strip comments
  s/isDebug: *1/deps:['$LOADERMID']/;        # Remove isDebug, add deps
  s/<script src=\"$LOADERMID.*?\/script>//;  # Remove script app/run
  s/\s+/ /g;                                 # Collapse white-space" > "$DISTDIR/index.html"

#Move dojo folders to correct location
mkdir public/vendor
mkdir public/vendor/dojo
mkdir public/vendor/dojo/dojo
cp public/dojo/dojo.js public/vendor/dojo/dojo
cp public/dojo/dojo.js.uncompressed.js public/vendor/dojo/dojo
rm -rf public/dojo
rm -rf public/dijit

cp -r src/vendor/postprocessing/ public/vendor/
cp -r src/vendor/ShaderExtras.js public/vendor/
cp -r vendor/threex.dragpancontrols.js public/vendor/
cp -r vendor/three.js/ public/vendor/
cp -r vendor/threex public/vendor/

echo "Build complete"
