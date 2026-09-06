// ml5 part

let handModel;
let hands = [];

function preload() {

  // Modellen klarnår kameraet bliver startet.
  handModel = ml5.handPose();
}

function startHand(video) {
  handModel.detectStart(video, gotHands);
}

function gotHands(data) {
  hands = data;
}

function getPoints(h) {
  if (!h) return null;
  return h.keypoints || h.landmarks;
}

function dist2(a, b) {
  // P5's dist funktion her den allerede kan regne afstand mellem to punkter.
  return dist(a.x, a.y, b.x, b.y);
}

function fingerUp(tip, pip, mcp, pts) {
  let wrist = pts[0];
  let tipD = dist2(wrist, pts[tip]);
  let pipD = dist2(wrist, pts[pip]);
  let mcpD = dist2(wrist, pts[mcp]);
  let limit = max(pipD, mcpD * 0.92);
  return tipD > limit * 1.05;
}

function thumbUp(pts) {
  // Tommelfingeren får  egen funktion vender anerledes
  let wrist = pts[0];
  let tipD = dist2(wrist, pts[4]);
  let pipD = dist2(wrist, pts[3]);
  let mcpD = dist2(wrist, pts[2]);
  let limit = max(pipD, mcpD * 1.1);
  return tipD > limit * 1.08;
}

function countFingers(hand) {
  let pts = getPoints(hand);
  if (!pts || pts.length < 21) return 0;

  let n = 0;

  // Læg 1 til for hver finger der ser ud til at være oppe.
  if (thumbUp(pts)) n++;
  if (fingerUp(8, 6, 5, pts)) n++;
  if (fingerUp(12, 10, 9, pts)) n++;
  if (fingerUp(16, 14, 13, pts)) n++;
  if (fingerUp(20, 18, 17, pts)) n++;

  return n;
}
