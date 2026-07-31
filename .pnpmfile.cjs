function readPackage(pkg) {
  // Allow build scripts for packages that require native builds
  // This is needed for Hostinger compatibility
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
