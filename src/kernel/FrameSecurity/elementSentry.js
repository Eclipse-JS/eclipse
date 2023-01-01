function sentry() {
  const fbV2 = document.getElementById("framebuffer_v2");
  if (fbV2.innerHTML.includes("<script>") || fbV2.innerHTML.includes("</script>")) {
    panic("Security bypass remanents have been detected. You have been compromised.", "Kernel::Sentry");
  }

  setTimeout(sentry, 200);
}