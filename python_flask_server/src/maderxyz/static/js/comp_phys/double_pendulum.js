import { draw_line } from "../utils/drawing_utils.js";
import { draw_point } from "../utils/drawing_utils.js";

const fps_goal = 60;
const line_width = 2;
var tail_length = 175;

var paused = false;
var frame_idx;
var W, H, o_x, o_y;

var data = $("#double_pendulum_canvas").data("ys");
var L, r;

var cartesian_coords, x_1, y_1, x_2, y_2;
var phi_1, phi_2;
var phi_1p, phi_2p, phi_1c, phi_2c;
var x_1p, y_1p, x_2p, y_2p, x_1c, y_1c, x_2c, y_2c;

function get_positions_from_angles(phi_1, phi_2) {
  let x_1 = o_x + L * Math.sin(phi_1); // first body
  let y_1 = o_y + L * Math.cos(phi_1);
  let x_2 = x_1 + L * Math.sin(phi_2); // second body
  let y_2 = y_1 + L * Math.cos(phi_2);
  return [x_1, y_1, x_2, y_2];
}

function draw_tails(ctx, frame_idx, tail_length) {
  var current_system_state, previous_system_state;
  var alpha, green, red, fancy_variable_name;

  for (const idx of Array(tail_length).keys()) {
    fancy_variable_name = frame_idx - tail_length + idx;
    current_system_state = data[Math.max(0, fancy_variable_name)];
    previous_system_state = data[Math.max(0, fancy_variable_name - 1)];

    phi_1p = previous_system_state[0];
    phi_2p = previous_system_state[1];
    cartesian_coords = get_positions_from_angles(phi_1p, phi_2p);
    x_1p = cartesian_coords[0];
    y_1p = cartesian_coords[1];
    x_2p = cartesian_coords[2];
    y_2p = cartesian_coords[3];

    phi_1c = current_system_state[0];
    phi_2c = current_system_state[1];
    cartesian_coords = get_positions_from_angles(phi_1c, phi_2c);
    x_1c = cartesian_coords[0];
    y_1c = cartesian_coords[1];
    x_2c = cartesian_coords[2];
    y_2c = cartesian_coords[3];

    alpha = idx / tail_length;
    green = "rgba(0, 255, 0, " + String(alpha) + ")";
    red = "rgba(255, 0, 0, " + String(alpha) + ")";
    draw_line(ctx, x_1p, y_1p, x_1c, y_1c, green);
    draw_line(ctx, x_2p, y_2p, x_2c, y_2c, red);
  }
}

function draw_double_pendulum(ctx, frame_idx) {
  const system_state = data[frame_idx];

  phi_1 = system_state[0];
  phi_2 = system_state[1];

  cartesian_coords = get_positions_from_angles(phi_1, phi_2);
  x_1 = cartesian_coords[0];
  y_1 = cartesian_coords[1];
  x_2 = cartesian_coords[2];
  y_2 = cartesian_coords[3];

  draw_tails(ctx, frame_idx, tail_length);
  draw_point(ctx, o_x, o_y, r);
  draw_point(ctx, x_1, y_1, r);
  draw_point(ctx, x_2, y_2, r);
  draw_line(ctx, o_x, o_y, x_1, y_1, "white");
  draw_line(ctx, x_1, y_1, x_2, y_2, "white");
}

const setup_event_listeners = () => {
  // event listeners
  document
    .getElementById("restart_double_pendulum")
    .addEventListener("click", function () {
      frame_idx = 0;
      // zoom_level = W / 2;
    });
  let button_toggle_pause = document.getElementById(
    "play/pause_double_pendulum"
  );
  button_toggle_pause.addEventListener("click", function () {
    paused = !paused;
    if (paused) {
      button_toggle_pause.innerHTML = "unpause";
    } else {
      button_toggle_pause.innerHTML = "pause";
    }
  });
};

const init = () => {
  const canvas = document.getElementById("double_pendulum_canvas");
  W = canvas.getBoundingClientRect().width;
  H = W;
  canvas.width = W;
  canvas.height = W;

  const ctx = canvas.getContext("2d");
  ctx.lineWidth = line_width;

  // & coordinate origin o_x & o_y
  o_x = W / 2;
  o_y = H / 2;
  // set pendulum rod length L & body drawing radius
  L = W / 4 - 10;
  r = W / 75;

  setup_event_listeners();

  // start loop, draw double pendulum
  frame_idx = 0;
  setInterval(function () {
    if (paused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_double_pendulum(ctx, frame_idx);

    // let slider_tail_length = document.getElementById("slider_tail_length");
    // tail_length = Number(slider_tail_length.value);

    frame_idx += 1;
  }, 1000 / fps_goal);
};

init();
