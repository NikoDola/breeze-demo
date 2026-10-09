const previewWidth = 1440;
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const preview = entry.target;
    const frame = preview.querySelector('iframe');
    const scale = entry.contentRect.width / previewWidth;
    frame.style.height = `${entry.contentRect.height / scale}px`;
    frame.style.transform = `scale(${scale})`;
  }
});
document.querySelectorAll('.preview').forEach((preview) => observer.observe(preview));
