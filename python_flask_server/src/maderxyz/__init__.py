import json
import os

from flask import Flask, render_template
import numpy as np

from .config import INDEX_NAVGRID_SECTIONS
from .config import PATH_TO_STATIC


app = Flask(__name__)


# index
@app.route("/")
def index():
    props = {"nav_grid_sections": INDEX_NAVGRID_SECTIONS}
    return render_template("index.html", props=props)


@app.route("/comp_phys/n_body/<subdir>")
def comp_phys_n_body(subdir):
    if subdir == "3body_fig8":
        # load output data
        path_to_output_file = os.path.join(
            PATH_TO_STATIC,
            "txt/3body_fig8.txt"
        )
        system_states = [list(i) for i in np.loadtxt(path_to_output_file)]
        # append dict containing simulation info to list
        simulations = [{
            "system_states": json.dumps(system_states[:1000]),
            "sim_id": "3body_fig8",
            "sim_idx": 0,
            "sim_title": "stable 3-body orbit - figure eight"
        }]
        # return props directory
        template = "comp_phys/n_body/n_body.html"
        props = {"simulations": simulations}
        return render_template(template, props=props)

    elif subdir in ["3body_moon", "flowers", "cloud", "asteroids"]:
        template = f"comp_phys/n_body/{subdir}.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/harmonical_oscillators/<subdir>")
def comp_phys_pendulum(subdir):
    if subdir == "single_pendulum":
        template = "comp_phys/oscillators/single_pendulum.html"
        props = {
            "title": "pendulum",
        }
        return render_template(template, props=props)

    elif subdir == "double_pendulum":
        path_to_output_file = os.path.join(
            PATH_TO_STATIC, "txt/double_pendulum.txt"
        )
        system_states = [list(i) for i in np.loadtxt(path_to_output_file)]
        template = "comp_phys/oscillators/double_pendulum.html"
        props = {
            "title": "double pendulum",
            "description": "theory, latex...",  # TODO: remove? is this used anywhere?
            "ys": json.dumps(system_states),
        }
        return render_template(template, props=props)

    elif subdir == "lissajous":
        template = "comp_phys/oscillators/lissajous.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/cellular_automata/<subdir>")
def comp_phys_cellular_automata(subdir):
    if subdir in ["game_of_life", "forest_fire", "rock_paper_scissors"]:
        template = f"comp_phys/cellular_automata/{subdir}.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/fluid_dynamics/<subdir>")
def comp_phys_fluid_dynamics(subdir):
    if subdir in ["incompressible_fluid", "diffusion"]:
        template = f"comp_phys/fluid_dynamics/{subdir}.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/stat_phys/<subdir>")
def comp_phys_stat_phys(subdir):
    if subdir in ["brownian_motion", "ising"]:
        template = f"comp_phys/stat_phys/{subdir}.html"
        props = {}
        return render_template(template, props=props)

    elif subdir == "thermal_motion":
        template = "comp_phys/stat_phys/thermal_motion.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/monte_carlo/<subdir>")
def comp_phys_monte_carlo(subdir):
    if subdir == "pi_darts":
        template = "comp_phys/monte_carlo/pi_darts.html"
        props = {}
        return render_template(template, props=props)

    if subdir == "ants":
        template = "comp_phys/monte_carlo/ants.html"
        props = {}
        return render_template(template, props=props)

    if subdir == "boids":
        template = "comp_phys/monte_carlo/boids.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/electro_magnetism/<subdir>")
def comp_phys_electro_magnetism(subdir):
    if subdir == "charge_interaction":
        template = "comp_phys/electro_magnetism/charge_interaction.html"
        props = {}
        return render_template(template, props=props)


@app.route("/comp_phys/various/<subdir>")
def comp_phys_various(subdir):
    if subdir == "quadtree":
        template = "comp_phys/various/quadtree.html"
        props = {}
        return render_template(template, props=props)
    elif subdir == "lorentz":
        template = "comp_phys/various/lorentz.html"
        props = {}
        return render_template(template, props=props)


@app.route("/various/draw")
def various_draw():
    template = "various/draw.html"
    props = {}
    return render_template(template, props=props)


if __name__ == "__main__":
    app.run()
