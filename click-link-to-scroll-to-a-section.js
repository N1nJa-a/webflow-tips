<script>
  document.addEventListener("DOMContentLoaded", () => {
    // give "trigger" id to button/link
    const triggerButton = document.getElementById("trigger"); 

    // give "target" id to target div you want to scroll to
    const targetDiv = document.getElementById("target"); 

    triggerButton.addEventListener("click", () => {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    });
  });
</script>
