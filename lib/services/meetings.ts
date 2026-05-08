export function buildJitsiRoomUrl(roomName: string) {
  const base = process.env.JITSI_BASE_URL || "https://meet.jit.si";
  return `${base}/${encodeURIComponent(roomName)}`;
}
