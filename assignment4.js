import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

export class Assignment4 extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        this.shapes = {
            box_1: new Cube(),
            box_2: new Cube(),
            axis: new Axis_Arrows(),
            cube: new Cube(),
            cube2: new Cube(),
            square: new defs.Square(),
            square2: new defs.Square(),
            sun: new defs.Subdivision_Sphere(4),
            plant: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 25),
        }
        console.log(this.shapes.box_1.arrays.texture_coord)

        // TODO: Display the texture four times on each side
        // this.shapes.box_2.arrays.texture_coord = [
        //     Vector.of(0, 0), Vector.of(2, 0), Vector.of(0, 2), Vector.of(2, 2),
        //     Vector.of(0, 0), Vector.of(2, 0), Vector.of(0, 2), Vector.of(2, 2),
        //     Vector.of(0, 0), Vector.of(2, 0), Vector.of(0, 2), Vector.of(2, 2),
        //     Vector.of(0, 0), Vector.of(2, 0), Vector.of(0, 2), Vector.of(2, 2),
        //     Vector.of(0, 0), Vector.of(2, 0), Vector.of(0, 2), Vector.of(2, 2),
        //     Vector.of(0, 0), Vector.of(2, 0), Vector.of(0, 2), Vector.of(2, 2),
        // ]
        this.shapes.box_2.arrays.texture_coord.forEach(v => v.scale_by(2));
        this.shapes.cube.arrays.texture_coord.forEach(v => v.scale_by(1));
        this.shapes.square.arrays.texture_coord.forEach(v => v.scale_by(8));
        this.shapes.cube2.arrays.texture_coord.forEach(v => v.scale_by(-1));
        this.shapes.plant.arrays.texture_coord.forEach(v => v.scale_by(-2));
        this.shapes.square2.arrays.texture_coord.forEach(v => v.scale_by(10));

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#000000")}),

            phong: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
            }),
            texture_1: new Material(new Texture_Rotate(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/stars.png", "NEAREST")
            }),
            texture_2: new Material(new Texture_Scroll_X(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/earth.gif", "LINEAR_MIPMAP_LINEAR")
            }),
            sun_material: new Material(new defs.Phong_Shader(),
                {ambient: 1}),

            sunset: new Material(new defs.Phong_Shader(), {
                color: hex_color("#edb0ff"),
                ambient: 0.5,
            }),

            day: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/resized-image-Promo.jpeg", "NEAREST")}),

            afternoon: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/resized-image-Promo-2.jpeg", "NEAREST")}),

            night: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/resized-image-Promo-3.jpeg", "NEAREST")}),

            moving_sunset: new Material(new Texture_Scroll_X(), {
                color: hex_color("#000000"),
                ambient: 1,
                texture: new Texture("assets/sunset.jpg", "LINEAR_MIPMAP_LINEAR")}),

            ground: new Material(new defs.Textured_Phong(), {
                color: hex_color("#262626"),
                specularity: 1,
                ambient: 1,
                texture: new Texture("assets/grasstxt.jpeg", "NEAREST")}),

            building_material: new Material(new Textured_Phong(), {
                ambient: 1,
                specularity: 1,
                color: hex_color("#000000"),
                texture: new Texture("assets/brks.jpg", "NEAREST")
            }),
            building_material2: new Material(new Textured_Phong(), {
                ambient: 1,
                specularity: 1,
                color: hex_color("#1e1c1c"),
                texture: new Texture("assets/brks.jpeg", "NEAREST")
            }),
            plant_material: new Material(new Textured_Phong(), {
                ambient: 1,
                specularity: 1,
                color: hex_color("#1e1c1c"),
                texture: new Texture("assets/roses_edit.jpg", "NEAREST")
            }),

            dirt_material: new Material(new Textured_Phong(), {
                ambient: 1,
                specularity: 1,
                color: hex_color("#000000"),
                texture: new Texture("assets/dirt_resized.jpeg", "NEAREST")
            }),
        }

        //this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.initial_camera_location = Mat4.look_at(vec3(0, 0, 17), vec3(0, 0, 0), vec3(0, 1, 0));

        this.isRotate = false;

        this.isDay = false;
        this.isAfternoon = false;
        this.isNight = false;

        this.box_1_transform = Mat4.identity().times(Mat4.translation(-2, 0, 0));
        this.box_2_transform = Mat4.identity().times(Mat4.translation(2, 0, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("View entire scene", ["Control", "0"], () => this.attached = () => this.initial_camera_location);
        this.new_line();
        this.key_triggered_button("Day", ["Control", "d"], () => {
            this.isDay = true;
            this.isNight = false;
            this.isAfternoon = false;

        });
        this.new_line();
        this.key_triggered_button("Afternoon", ["Control", "a"], () => {
            this.isDay = false;
            this.isNight = false;
            this.isAfternoon = true;
        });
        this.new_line();
        this.key_triggered_button("Night", ["Control", "n"], () => {
            this.isDay = false;
            this.isNight = true;
            this.isAfternoon = false;
        });
        this.new_line();
        this.key_triggered_button("Attach to plant 1", ["Control", "1"], () => this.attached = () => this.plant_1);
        // this.new_line();
        this.key_triggered_button("Attach to plant 2", ["Control", "2"], () => this.attached = () => this.plant_2);
        // this.new_line();
        this.key_triggered_button("Attach to plant 3", ["Control", "3"], () => this.attached = () => this.plant_3);
        // this.new_line();
        this.key_triggered_button("Attach to plant 4", ["Control", "4"], () => this.attached = () => this.plant_4);
        // this.new_line();
        this.key_triggered_button("Attach to plant 5", ["Control", "5"], () => this.attached = () => this.plant_5);
        // this.new_line();
        this.key_triggered_button("Attach to plant 6", ["Control", "6"], () => this.attached = () => this.plant_6);
        // this.new_line();
        this.key_triggered_button("Attach to plant 7", ["Control", "7"], () => this.attached = () => this.plant_7);
        // this.new_line();
        this.key_triggered_button("Attach to plant 8", ["Control", "8"], () => this.attached = () => this.plant_8);
        // this.new_line();
    }

    display(context, program_state) {
        // if (!context.scratchpad.controls) {
        //     this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
        //     // Define the global camera and projection matrices, which are stored in program_state.
        //     program_state.set_camera(Mat4.translation(0, 0, -8));
        // }
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // const light_position = vec4(10, 10, 10, 1);
        // program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();

        const yellow = hex_color("#fac91a");
        let sun_y = Math.abs(20 * Math.sin(t/3 + Math.PI/2));
        let sun_x = 35 * Math.sin(t/3);

        let light_position = vec4(sun_x, sun_y, -45, 1);

        // sun stuff
        const sun_rad = 4;
        const sun_color = yellow;

        const plant_rad = 0.5;


        this.light_color = color(
            1.667 + Math.sin(t/500) / 3,
            1.667 + Math.sin(t/1500) / 3,
            0.667 + Math.sin(t/3500) / 3,
            1
        );

        const light_size = sun_rad ** 30;
        program_state.lights = [new Light(light_position, this.light_color, light_size)];
        // TODO:  Draw the required boxes. Also update their stored matrices.
        // You can remove the following line.

        // if (this.isRotate) {
        //     this.box_1_transform = this.box_1_transform.times(Mat4.rotation(dt * 3 ,1,0, 0));
        //     this.box_2_transform = this.box_2_transform.times(Mat4.rotation(dt * 2,0,1, 0));
        // }
        //
        // this.shapes.box_1.draw(context, program_state, this.box_1_transform, this.materials.texture_1);
        // this.shapes.box_2.draw(context, program_state, this.box_2_transform, this.materials.texture_2);

        let model_transform_sun = model_transform.times(Mat4.translation(sun_x, sun_y, -45))
            .times(Mat4.scale(sun_rad, sun_rad, sun_rad));
        this.shapes.sun.draw(context, program_state, model_transform_sun, this.materials.sun_material.override({color: sun_color}));

        let sunset_transform = Mat4.identity();
        sunset_transform = sunset_transform.times(Mat4.translation(0,0,-50))
            .times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(65,45,0));

        let ground_transform = Mat4.identity();
        ground_transform = ground_transform.times(Mat4.translation(0,-4,0)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(45,30,100));
        this.shapes.square.draw(context, program_state, ground_transform, this.materials.ground);

        let path_transform = Mat4.identity();
        path_transform = path_transform.times(Mat4.translation(0,-3.9,0)).times(Mat4.rotation(Math.PI/2, 1, 0, 0)).times(Mat4.scale(4, 14, 0));
        this.shapes.square2.draw(context, program_state, path_transform, this.materials.dirt_material);

        if (this.isDay) {
            this.shapes.cube.draw(context, program_state, sunset_transform, this.materials.day);
        }
        else if (this.isAfternoon)
        {
            this.shapes.cube.draw(context, program_state, sunset_transform, this.materials.afternoon);
        }
        else if (this.isNight)
        {
            this.shapes.cube.draw(context, program_state, sunset_transform, this.materials.night);
        }
        else
        {
            this.shapes.cube.draw(context, program_state, sunset_transform, this.materials.moving_sunset);
        }

        let column1_transform = Mat4.identity();
        column1_transform = column1_transform.times(Mat4.translation(-10, -4, -14))
            .times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(1.6,11,3));
        this.shapes.cube2.draw(context, program_state, column1_transform, this.materials.building_material);

        let column2_transform = Mat4.identity();
        column2_transform = column2_transform.times(Mat4.translation(10, -4, -14))
            .times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(1.6,11,3));
        this.shapes.cube2.draw(context, program_state, column2_transform, this.materials.building_material);

        let side1_transform = Mat4.identity();
        side1_transform = side1_transform.times(Mat4.translation(18, -4, -18))
            .times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(8,4.5,6));
        this.shapes.cube2.draw(context, program_state, side1_transform, this.materials.building_material);

        let side2_transform = Mat4.identity();
        side2_transform = side2_transform.times(Mat4.translation(-18, -4, -18))
            .times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(8,4.5,6));
        this.shapes.cube2.draw(context, program_state, side2_transform, this.materials.building_material);

        let middle_transform = Mat4.identity();
        middle_transform = middle_transform.times(Mat4.translation(0, -4, -18))
            .times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(10,7,6));
        this.shapes.cube2.draw(context, program_state, middle_transform, this.materials.building_material2);

        let plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(-10,-3.5,2)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        let plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(-9.5,-3.5,1.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_1 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        let plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(-8.7,-3.5,2.1)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(7,-3.5,2)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(6.5,-3.5,1.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_2 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(5.7,-3.5,2.1)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(10,-3.5,10)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(9.5,-3.5,9.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_3 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(8.7,-3.5,10.1)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(13.8,-3.5,-4)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(14.5,-3.5,-4.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_4 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(15.3,-3.5,-5.1)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(-13.8,-3.5,-4)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(-14.5,-3.5,-4.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_5 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(-15.3,-3.5,-5.1)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(-10,-3.5,-7)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(-9.5,-3.5,-6.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_6 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(-8.7,-3.5,-5.9)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(-15,-3.5,7)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(-14.5,-3.5,6.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_7 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(-13.7,-3.5,5.9)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);

        plant_transform = Mat4.identity();
        plant_transform = plant_transform.times(Mat4.translation(15,-3.5,7)).times(Mat4.rotation(Math.PI/2, 1, 0, 0))
            .times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform2 = Mat4.identity();
        plant_transform = plant_transform2.times(Mat4.translation(14.5,-3.5,6.5)).times(Mat4.scale(1.7*plant_rad,1.7*plant_rad,1.7*plant_rad));
        this.plant_8 = plant_transform;
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        plant_transform3 = Mat4.identity();
        plant_transform = plant_transform3.times(Mat4.translation(13.7,-3.5,5.9)).times(Mat4.scale(plant_rad,plant_rad,plant_rad));
        this.shapes.plant.draw(context, program_state, plant_transform, this.materials.plant_material);
        // end of plant stuff

        //inside of royce columns
        let column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(0,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(2,4,6));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(6,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(1,3,4));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-6,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(1,3,4));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        //side building blackout windows
        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-16,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-19,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-13,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-22,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-24,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(16,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);
        column_transform = Mat4.identity();

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(19,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(13,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(22,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(24,-4,-11.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.75,1.5,1.5));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        // column's blackout windows
        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-10,-3,-10.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.65,1,1));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(-10,2,-10.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.65,1,1));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(10,-3,-10.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.65,1,1));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

        column_transform = Mat4.identity();
        column_transform = column_transform.times(Mat4.translation(10,2,-10.9)).times(Mat4.rotation(Math.PI, 1, 0, 0))
            .times(Mat4.scale(0.65,1,1));
        this.shapes.square.draw(context, program_state, column_transform, this.materials.test);
        column_transform = column_transform.times(Mat4.translation(0,-0.4,0))
        this.shapes.circle.draw(context, program_state, column_transform, this.materials.test);

    }
}


class Texture_Scroll_X extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #6.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color_coord = vec4(f_tex_coord, 0.0, 1.0);
                vec2 tex_color_coord2 = vec2(tex_color_coord.x, tex_color_coord.y  + mod(-1.* (animation_time / 10.), 1.0));

                vec4 tex_color = texture2D( texture, tex_color_coord2);
                
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}


class Texture_Rotate extends Textured_Phong {
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #7.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            void main(){
                // Sample the texture image in the correct place:
                mat4 down = mat4(1.0,0.0,0.0,0.0,  0.0,1.0,0.0,0.0,  0.0,0.0,1.0,0.0,  -0.5,-0.5,0.0,1.0);
             
                float PI = -3.1415926;
                
                mat4 rotate = mat4(cos(PI/2.0 * animation_time),sin(PI/2.0 * animation_time),0.,0., 
                    -sin(PI/2.0 * animation_time),cos(PI/2.0 * animation_time),0.,0., 
                    0,0,1,0, 
                    0,0,0,1);
                    
                mat4 up = mat4(1.0,0.0,0.0,0.0,  0.0,1.0,0.0,0.0,  0.0,0.0,1.0,0.0,  0.5,0.5,0.0,1.0);
                
                vec4 tex_color_coord = up * rotate * down * vec4(f_tex_coord, 0, 1);
                vec2 tex_color_coord2 = vec2(tex_color_coord.xy);
                vec4 tex_color = texture2D( texture, tex_color_coord2 ); 
                     
                float x = mod(tex_color_coord2.x, 1.0);
                float y = mod(tex_color_coord2.y, 1.0);
             
                if (x > 0.15 && x < 0.25 && y > 0.15 && y < 0.85) {
                    tex_color = vec4(0.0, 0.0, 0.0, 1.0);
                }
                
                if (x > 0.75 && x < 0.85 && y > 0.15 && y < 0.85) {
                    tex_color = vec4(0.0, 0.0, 0.0, 1.0);
                }
               
                if (y > 0.15 && y < 0.25 && x > 0.15 && x < 0.85) {
                    tex_color = vec4(0.0, 0.0, 0.0, 1.0);
                }
                
                if (y > 0.75 && y < 0.85 && x > 0.15 && x < 0.85) {
                    tex_color = vec4(0.0, 0.0, 0.0, 1.0);
                }                
                      
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}

