import * as THREE from "three";
import {Stats} from "three-stats/dist/index";
import BaseObject from "./Obj";
import * as EVENTS from "./Events";
import { MapControls } from "../controls/OrbitControl";
import {CSS2DObject, CSS2DRenderer} from "./CSS2DRenderer";
import * as TWEEN from "@tweenjs/tween.js";
import { Material, Object3D, Vector3 } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as OPTIONS from "./Options";
import { LineGeometry } from "../libs/lines/LineGeometry";
import { LineMaterial } from "../libs/lines/LineMaterial";
import { Line2 } from "../libs/lines/Line2";
import { compressSync } from "../libs/fflate.module";

type options = {
	flash_speed? : number;
	open_fps? : boolean;
	card_type? : number;
	open_little_map? : boolean;
	ex_dom_element? : string;
	offset_top? : number;
	offset_left? : number;
	track_height? : number;
	track_animation_length? : number;
	track_position_length? : number;
	select_color? : number;
	flash_color_1? : number;
	flash_color_2? : number;
	scale_dist? : number;
	cache_time? : number;
	camera_tween_speed? : number;
	camera_speed? : number;
	camera_rotate_speed? : number;
	camera_model_patrol_dist? : number;
	patrol_circle_number? : number;
	animation_enable? : boolean;
	cluster_enable? : boolean;
	camera_dist? : number;
	third_person_target_height? : number;
	third_person_dist? : number;
	third_person_camera_height? : number;
	scene_url: string;
	dom_element: string;
	open_shadow?: boolean;
	shadow_model_url?: string;
	show_click_marker?: boolean;
	marker_model_url?: string;
};

class HGMap extends BaseObject{
	private renderer:THREE.WebGLRenderer;

	private readonly scene:THREE.Scene;
	private readonly camera:THREE.PerspectiveCamera;
	private file_loader:THREE.FileLoader;
	private object_loader:THREE.ObjectLoader;
	private scene_url;
	private stats:Stats;
	private next_frame_request:number;
	protected dom: HTMLElement | null;

	private controls:MapControls;

	private map_group:THREE.Group;       /*储存地图文件上的所有mesh,light */
	private target:THREE.Vector3;
	private mousedownXY:number[];
	private mouseupXY:number[];

	private _click_select_obj:(THREE.Object3D&{model_height?:number,model_id?:number,model_type?:string,model_format?:string,label?:CSS2DObject})|undefined;           /* 当前选中的模型*/

	private _select_card_id:number|undefined;          /* 当前选中的卡号*/
	private raycaster:THREE.Raycaster;               /* 通过该射线来判断是否点击中的物体 */	
	private all_model_in_the_scene:THREE.Group;    /* 所有已经被添加到场景里的模型，会被用来判断点击等作用 */
	private select_color:number = 16777215;
	private all_model:{[index:string]:THREE.Object3D&{model_height?:number,model_id?:number,model_type?:string,model_format?:string,label?:CSS2DObject}};
	private last_click_position:{[index:string]:number}|undefined;
	private all_card:any[] = [];                                  /* 所有已经添加到地图的定位卡对象 */
	private area_group:THREE.Group;    /* 储存所有区域mesh */
	private camera_speed:number = 1;
	private label_renderer:CSS2DRenderer;
	private all_card_animation_position:any;
	private last_animation_time:number|undefined;
	private init_camera_position:THREE.Vector3;
	private init_target_position:THREE.Vector3;
	private fbx_loader:FBXLoader;
	private gltf_loader:GLTFLoader;
	private all_user_custom_model:any;
	private mixers:any;                                    /* fbx模型动画 */
	private options:options;
	private shadow_group:THREE.Group;
	private all_shadow_model:any = [];
	private all_track_card:any = [];                   /* 需要轨迹的卡号 */
	private all_track_card_is_show:boolean[] = [];                   /* 该卡号轨迹是否需要显示 */
	private	all_track_color:any = [];                   /* 控制轨迹的颜色 */
	private all_track_card_position:{[index:number]:({x:number,y:number,z:number}[]|undefined)} = {};                   /* 存储轨迹追踪的卡的历史点 */
	private all_track_card_animation:{[index:number]:({x:number,y:number,z:number}[]|undefined)} = {};
	private now_patrol_card:number|undefined;
	private camera_tween:TWEEN.Tween<THREE.Vector3>|undefined;
	// private target_tween:any;
	private is_camera_rotate:boolean; 
	private all_flash_card:any = [];   

	private all_zone_list:any = [];                   /* 所有的区域对象 */
	private all_flash_zone_list:any = [];                   /* 所有闪烁的区域对象 */
	private all_zone_material:any = [];                   /* 所有的区域材质 */
	private all_zone_edge_line:any = [];                   /* 所有的区域边线 */
	private flash_zone_material:THREE.MeshBasicMaterial;
	private flash_count:number = 0;
	private update_count:number = 0;                    /* 渲染计数 */

	private track_line_group:THREE.Group;    /* 储存所有轨迹mesh */
	private all_base_station_model:{[index:number]:THREE.Object3D} = {};                    /* 所有已经被添加到场景里的基站模型，方便对基站进行批量操作 */

	// private render_track_card_position:any = {};
	private camera_rotate_number:number;
	private camera_rotate_speed:number;
	// private camera_rotate_count:number;

	private third_person_init_rotate:number;
	private third_person_camera_rotate:{y:number};
	private third_person_card:number|undefined;
	private third_person_rotate_tween:TWEEN.Tween<{y:number}>;
	private track_geometry:LineGeometry;
	private track_material:LineMaterial;
	private track_mesh:Line2;
	// private all_track_point_count:any = [];                   /* 轨迹目前的点数量 */
	private over_view_camera:THREE.OrthographicCamera;

	private cluster_center_dict:any;
	private click_position_model:any;

	constructor (options:options) {
		super();
		THREE.Cache.enabled = true;
		this._initOptions(options);   
		this.scene_url = options.scene_url;
		this.dom = document.getElementById(options.dom_element);           /* 3D地图的DOM容器 */
		if (!this.dom)
			throw new Error('dom对象不存在');

		// 添加fps窗口
		this.openFPS();

		this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true, alpha:true});
		this.renderer.setClearColor(0xffffff, 0.0);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
		this.renderer.clearColor();

		this.label_renderer = new CSS2DRenderer();
		(this.label_renderer as any).setSize(this.dom.clientWidth, this.dom.clientHeight);
		(this.label_renderer as any).domElement.style.position = 'absolute';
		(this.label_renderer as any).domElement.style['pointer-events'] = "none";         // 因为会在canvas上层会遮挡事件，导致MapControls无法正常使用，使用该css来取消影响
		this.dom.appendChild((this.label_renderer as any).domElement);
		this.dom.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(45, this.dom.clientWidth / this.dom.clientHeight, 1, 1000);
		this.camera.position.set( 100, 100, 100 );
		this.camera.lookAt(0, 0, 0);
		this.camera.updateProjectionMatrix();
		this.controls = new MapControls(this.camera, this.renderer.domElement);
		this.controls.maxPolarAngle = Math.PI / 2.2;

		this._click_select_obj = undefined;            /* 当前选中的模型*/
		this._select_card_id = undefined;            /* 当前选中的卡号*/
		this.raycaster = new THREE.Raycaster();/* 通过该射线来判断是否点击中的物体 */	
		this.all_model_in_the_scene = new THREE.Group();    /* 所有已经被添加到场景里的模型，会被用来判断点击等作用 */
		this.all_model_in_the_scene.name = "modelGroup";
		this.area_group = new THREE.Group();    /* 储存所有区域mesh */
		this.area_group.name = "areaGroup";
		this.all_user_custom_model = {};                    /* 所有通过addStaticModel添加的用户自定义模型 */
		this.all_model = {};                                 /* 所有已加载的模型，包括默认的卡，基站，点击，阴影，和loadJsonModel加载的模型 */
		this.mixers = [];
		this.scene.add(this.all_model_in_the_scene);
		this.scene.add(this.area_group);

		this.track_line_group = new THREE.Group();    /* 储存所有轨迹mesh */
		this.track_line_group.name = "trackLineGroup";
		this.track_material = new LineMaterial({
			linewidth: 5, // in pixels
			vertexColors: true,
			resolution:new THREE.Vector2( this.dom.clientWidth, this.dom.clientHeight ),  // to be set by renderer, eventually
			dashed: false,
			alphaToCoverage: false,
		});
		this.scene.add(this.track_line_group);

		this.map_group = new THREE.Group();         /*储存地图文件上的所有mesh,light */
		this.map_group.name = "mapGroup";
		this.scene.add(this.map_group);

		/* 处理是否开启阴影 */
		if (this.options.open_shadow && this.options.shadow_model_url) {
			this.all_shadow_model = [];                          /* 所有已经添加到地图的定位卡阴影对象 */
			this.shadow_group = new THREE.Group();
			this.shadow_group.name = "shadowGroup";
			this.scene.add(this.shadow_group);

			/* 加载默认阴影模型 */
			this._loadJsonModel(this.options.shadow_model_url, "shadow");
		}

		/* 是否开启显示点击marker */
		if (this.options.show_click_marker && this.options.marker_model_url) {
			/* 加载默认定位点模型 */
			this._loadJsonModel(this.options.marker_model_url, "marker");
		}

		/* 绑定默认事件 */
		// this._bindDefaultDomEvents();


		this.file_loader = new THREE.FileLoader();
		this.object_loader = new THREE.ObjectLoader();

		this.file_loader.load(
			this.scene_url,
			this._handleMapFileLoadFinish.bind(this),
			this._handleMapFileLoadProgress,
			this._handleMapFileLoadErr
		);
	}
	/**
	 * 初始化配置项
	 *
	 * @ignore
	 */
	_initOptions = (options:options) => {
		this.options = options;
		if (this.options.flash_speed === undefined) this.options.flash_speed = OPTIONS.FLASH_SPEED;
		if (this.options.open_fps === undefined) this.options.open_fps = OPTIONS.OPEN_FPS;
		if (this.options.card_type === undefined) this.options.card_type = OPTIONS.CARD_TYPE;
		if (this.options.open_little_map === undefined) this.options.open_little_map = OPTIONS.OPEN_OVERVIEW_MAP;
		if (this.options.ex_dom_element === undefined) this.options.ex_dom_element = OPTIONS.EX_DOM_ELEMENT;
		if (this.options.offset_top === undefined) this.options.offset_top = OPTIONS.OFFSET_TOP;
		if (this.options.offset_left === undefined) this.options.offset_left = OPTIONS.OFFSET_LEFT;
		if (this.options.track_height === undefined) this.options.track_height = OPTIONS.TRACK_HEIGHT;
		if (this.options.track_animation_length === undefined) this.options.track_animation_length = OPTIONS.TRACK_ANIMATION_LENGTH;
		if (this.options.track_position_length === undefined) this.options.track_position_length = OPTIONS.TRACK_POSITION_LENGTH;
		if (this.options.select_color === undefined) this.options.select_color = OPTIONS.SELECT_COLOR;
		if (this.options.flash_color_1 === undefined) this.options.flash_color_1 = OPTIONS.FLASH_COLOR_1;
		if (this.options.flash_color_2 === undefined) this.options.flash_color_2 = OPTIONS.FLASH_COLOR_2;
		if (this.options.scale_dist === undefined) this.options.scale_dist = OPTIONS.SCALE_DIST;
		if (this.options.cache_time === undefined) this.options.cache_time = OPTIONS.CACHE_TIME;
		if (this.options.camera_tween_speed === undefined) this.options.camera_tween_speed = OPTIONS.CAMERA_TWEEN_SPEED;
		if (this.options.camera_speed === undefined) this.options.camera_speed = OPTIONS.CAMERA_SPEED;
		if (this.options.camera_rotate_speed === undefined) this.options.camera_rotate_speed = OPTIONS.CAMERA_ROTATE_SPEED;
		if (this.options.camera_model_patrol_dist === undefined) this.options.camera_model_patrol_dist = OPTIONS.CAMERA_MODEL_PATROL_DIST;
		if (this.options.patrol_circle_number === undefined) this.options.patrol_circle_number = OPTIONS.PATROL_CIRCLE_NUMBER;
		if (this.options.animation_enable === undefined) this.options.animation_enable = OPTIONS.ANIMATION_ENABLE;
		if (this.options.cluster_enable === undefined) this.options.cluster_enable = OPTIONS.CLUSTER_ENABLE;
		if (this.options.camera_dist === undefined) this.options.camera_dist = OPTIONS.CAMERA__DIST;
		if (this.options.third_person_target_height === undefined) this.options.third_person_target_height = OPTIONS.THIRD_PERSON_TARGET_HEIGHT;
		if (this.options.third_person_dist === undefined) this.options.third_person_dist = OPTIONS.THIRD_PERSON_DIST;
		if (this.options.third_person_camera_height === undefined) this.options.third_person_camera_height = OPTIONS.THIRD_PERSON_CAMERA_HEIGHT;
	};
	/**
	 * 处理鼠标按键按下事件
	 *
	 * @ignore
	 */
	private _handleDomMouseDown = (event:MouseEvent) => {
		this.mousedownXY = [event.clientX, event.clientY];      /**用来判断点击还是拖动*/
		if (!this.controls.enabled) return;
		this.dispatchEvent(EVENTS.MOUSEDOWN, event);
	}

	/**
	 * 处理鼠标按键松开事件
	 *
	 * @ignore
	 */
	private _handleDomMouseUp = (event:MouseEvent) => {
		this.mouseupXY = [event.clientX, event.clientY];        /**用来判断点击还是拖动*/
		if (!this.controls.enabled) return;
		this.dispatchEvent(EVENTS.MOUSEUP, event);
	}
	/**
	 * 获得两点间直线距离
	 *
	 * @ignore
	 */
	private _getTwoPointLineDistance = (pointA:number[], pointB:number[]) => {
		if (pointA.length == 2) {
			return Math.sqrt((pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]))
		// } else if (pointA.length == 3) {
		} else {
			return Math.sqrt((pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]) + (pointA[2] - pointB[2]) * (pointA[2] - pointB[2]))
		}
	}
	/**
	 * 选中模型
	 *
	 * @param {Number} model 需要被选中的模型
	 * @return {Boolean}  返回操作结果
	 */
	selectModel = (model:any) => {
		if (model === undefined) return false;

		if (model.independent_material === undefined) {
			model.material = model.material.clone();

			model.independent_material = true;
		}

		model.material.emissive.setHex(this.select_color);
	};

	/**
	 * 取消选中模型
	 * @param {Number} model 需要被取消选中的模型
	 * @return {Boolean} 返回操作结果
	 */
	unSelectModel = (model:any) => {
		if (model === undefined) return false;
		model.material.emissive.setHex(model.init_emissive_color);
	};
	/**
	 * 地图点击显示定位模型
	 *
	 * @ignore
	 */
	_clickShowPosition = (x:number, y:number, z:number) => {
		if (this.all_model["marker"] == undefined) return;
		if (this.click_position_model == undefined) {
			this.click_position_model = this.all_model["marker"];
			this.scene.add(this.click_position_model as any);
		}
		(this.click_position_model as any).position.set(x, y, z);
	};
	/**
	 * 转换坐标为屏幕像素坐标
	 * @param {Number[]} position 坐标
	 * @return {Number[]} 返回屏幕坐标
	 *
	 */
	positionToScreenXY = (position:THREE.Vector3) => {
		let sceneWidth = (this.dom as HTMLElement).clientWidth;
		let sceneHeight = (this.dom as HTMLElement).clientHeight;
		let pos = position.clone().project(this.camera);
		return {
			x: (pos.x + 1) * sceneWidth / 2,
			y: (-pos.y + 1) * sceneHeight / 2,
			z: pos.z
		}
	};
	/**
	 * 处理点击事件
	 *
	 * @ignore
	 */
	private _handleDomClick = (event:MouseEvent) => {
		if (this.mousedownXY === undefined || this.mouseupXY === undefined) return;
		if (this._getTwoPointLineDistance(this.mousedownXY, this.mouseupXY) > 0.1) return;       /**拖动不进行点击判断*/
		if (!this.controls.enabled) return;

		/**取消之前选中的模型*/
		if (this._click_select_obj !== undefined) {
			this.unSelectModel(this._click_select_obj);
			this._click_select_obj = undefined;
		}

		let mouse = new THREE.Vector2();
		mouse.x = (event.offsetX / (this.dom as HTMLElement).clientWidth) * 2 - 1;
		mouse.y = -(event.offsetY / (this.dom as HTMLElement).clientHeight) * 2 + 1;
		this.raycaster.setFromCamera(mouse, this.camera);

		/* 先判断是否点击中了各种模型*/
		let intersects = this.raycaster.intersectObject(this.all_model_in_the_scene, true);

		if (intersects.length > 0) {
			let click_target = intersects[0].object;

			/* TODO 点中隐藏的模型直接return，需要优化逻辑 */
			if (click_target.visible === false) return;
			if (click_target.parent && click_target.parent.visible === false) return;

			this._click_select_obj = intersects[0].object;

			/* 选中点击的模型*/
			this.selectModel(this._click_select_obj);

			/* 在点击的位置显示点击模型*/
			this._clickShowPosition(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
			this.last_click_position = {x: intersects[0].point.x, y: intersects[0].point.y, z: intersects[0].point.z};

			let click_model_position = this._click_select_obj!.position.clone();
			let model_height = this._click_select_obj!.model_height;
			let model_id = this._click_select_obj!.model_id;
			let model_type = this._click_select_obj!.model_type;
			/* 如果点击的带有动画的物体，需要单独处理*/
			if ((this._click_select_obj as any)?.isSkinnedMesh) {
				if ((this._click_select_obj as any).parent && this.all_card[(this._click_select_obj as any).parent.model_id]) {
					click_model_position = (this._click_select_obj as any).parent.position.clone();
					model_height = (this._click_select_obj as any).parent.model_height;
					model_id = (this._click_select_obj as any).parent.model_id;
					model_type = (this._click_select_obj as any).parent.model_type;
				}
			} 

			if (model_type == '1') {
				this._select_card_id = model_id;
			} else {
				this._select_card_id = undefined;
			}
			let model_position = {x: click_model_position.x, y: -1 * click_model_position.z, z: click_model_position.y};

			click_model_position.y += model_height as number;

			let event = {
				name: "clickmodel",
				model_id: model_id,
				model_type: model_type,
				position: model_position,
				screen_coord: this.positionToScreenXY(click_model_position)
			};

			this.dispatchEvent(EVENTS.SELECTEDMODEL, event);
			this.dispatchEvent(EVENTS.CLICKPOSITION, {
				point: {
					x: intersects[0].point.x,
					y: -intersects[0].point.z,
					z: intersects[0].point.y
				}
			});
			return;
		}

		/** 判断是否点中了区域*/
		intersects = this.raycaster.intersectObject(this.area_group, true);
		if (intersects.length > 0) {
			let key = intersects[0].object.userData.key;
			this.dispatchEvent(EVENTS.CLICKZONE, {id: key});
		}

		/**再判断是否点击中了地图*/
		intersects = this.raycaster.intersectObject(this.map_group, true);
		if (intersects.length > 0) {
			this._click_select_obj = undefined;
			this._select_card_id = undefined;
			this._clickShowPosition(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
			this.last_click_position = {x: intersects[0].point.x, y: intersects[0].point.y, z: intersects[0].point.z};
			this.dispatchEvent(EVENTS.CLICKPOSITION, {
				point: {
					x: intersects[0].point.x,
					y: -intersects[0].point.z,
					z: intersects[0].point.y
				}
			});
			return
		}
		this.last_click_position = undefined;
	}

	/**
	 * 处理双击事件
	 *
	 * @ignore
	 */
	private _handleDomDblClick = (event:MouseEvent) => {
		this.dispatchEvent(EVENTS.DBCLICK, event);
		if (this.last_click_position) {
			if (!this.controls.enabled) return;
			/**计算点击位置和摄像机的距离*/
			let dist = (this.last_click_position.x - this.camera.position.x) * (this.last_click_position.x - this.camera.position.x);
			dist = dist + (this.last_click_position.y - this.camera.position.y) * (this.last_click_position.y - this.camera.position.y);
			dist = dist + (this.last_click_position.z - this.camera.position.z) * (this.last_click_position.z - this.camera.position.z);
			this.controls.target = new THREE.Vector3(this.last_click_position.x, this.last_click_position.y, this.last_click_position.z);
			this.controls.update();

			/**如果距离比较远，需要设置动画，移动摄像机*/
			if (dist > 9) {
				dist = Math.sqrt(dist);
				let dest_x = this.last_click_position.x + (this.camera.position.x - this.last_click_position.x) * 3 / dist;
				let dest_y = this.last_click_position.y + (this.camera.position.y - this.last_click_position.y) * 3 / dist;
				let dest_z = this.last_click_position.z + (this.camera.position.z - this.last_click_position.z) * 3 / dist;
				let tween = new TWEEN.Tween(this.camera.position);
				tween.to({x: dest_x, y: dest_y, z: dest_z}, dist * this.camera_speed);
				tween.start();
			}
		}
	}

	/**
	 * 处理触摸开始事件
	 *
	 * @ignore
	 */
	private _handleDomTouchStart = (event:TouchEvent) => {
		this.dispatchEvent(EVENTS.TOUCHSTART, event);
		if (event.targetTouches && event.targetTouches.length == 1) {
			this.mousedownXY = [event.targetTouches[0].clientX, event.targetTouches[0].clientY];
		}
	}

	/**
	 * 处理触摸结束事件
	 *
	 * 在MapControls中，阻止了touchstart的默认事件，所以没法触发点击事件，
	 * 在移动端会出现没法点击的BUG，为了降低之后更新MapControls的难度，将toch有关事件
	 * 放到这里来处理
	 *
	 * @ignore
	 */
	private _handleDomTouchEnd = (event:TouchEvent) => {
		this.dispatchEvent(EVENTS.TOUCHEND, event);
		if (event.changedTouches && event.changedTouches.length == 1) {
			this.mouseupXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];

			if (this._getTwoPointLineDistance(this.mousedownXY, this.mouseupXY) < 0.1) {
				(this.dom as HTMLElement).dispatchEvent(new MouseEvent('click', {clientX: this.mouseupXY[0], clientY: this.mouseupXY[1]}))
			}
		}
	}

	/**
	 * 处理触摸移动事件
	 *
	 * @ignore
	 */
	private _handleDomTouchMove = (event:TouchEvent) => {
		this.dispatchEvent(EVENTS.TOUCHMOVE, event);
	}
	/**
	 * 设置地图的大小
	 *
	 * @ignore
	 */
	updateSize = () => {
		let w = (this.dom as HTMLElement).clientWidth;
		let h = (this.dom as HTMLElement).clientHeight;
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(w, h);
		(this.label_renderer as any).setSize(w, h);
	};
	/**
	 * 处理浏览器切换事件
	 *
	 * @ignore
	 */
	private _handleVisibilityChange = () => {
		if (document.visibilityState == 'hidden') {
			this.options.animation_enable = false;
			this.last_animation_time = undefined;
			for (let i in this.all_card) {
				let card_id = parseInt(i);
				this.all_card_animation_position[card_id] = [];
			}
		} else {
			this.options.animation_enable = true;
		}
	}

	/**
	 * 处理浏览器暂停事件
	 *
	 * @ignore
	 */
	private _handleAppPause = () => {
		this.options.animation_enable = false;
		this.last_animation_time = undefined;
		for (let i in this.all_card) {
			let card_id = parseInt(i);
			this.all_card_animation_position[card_id] = [];
		}
	}

	/**
	 * 处理浏览器继续事件
	 *
	 * @ignore
	 */
	private _handleAppResume = () => {
		this.options.animation_enable = true;
	}
	/**
	 * 给渲染容器绑定默认的事件
	 *
	 * @ignore
	 */
	_bindDefaultDomEvents = () => {
		(this.dom as HTMLElement).addEventListener("pointerdown", this._handleDomMouseDown.bind(this));
		(this.dom as HTMLElement).addEventListener("pointerup", this._handleDomMouseUp.bind(this));
		(this.dom as HTMLElement).addEventListener("click", this._handleDomClick.bind(this));
		(this.dom as HTMLElement).addEventListener("dblclick", this._handleDomDblClick.bind(this), false);
		(this.dom as HTMLElement).addEventListener("touchstart", this._handleDomTouchStart.bind(this));
		(this.dom as HTMLElement).addEventListener("touchend", this._handleDomTouchEnd.bind(this));
		(this.dom as HTMLElement).addEventListener("touchmove", this._handleDomTouchMove.bind(this));

		(this.renderer.getContext() as any).canvas.addEventListener("webglcontextlost", (event:any) => {
			event.preventDefault();
			cancelAnimationFrame(this.next_frame_request);
		}, false);

		(this.renderer.getContext() as any).canvas.addEventListener("webglcontextrestored", (event:any) => {
			this.next_frame_request = requestAnimationFrame(this._animation);
		}, false);

		/**需要监听浏览器大小变化事件，在浏览器大小发生变化后，需要调用setSize重新设置大小*/
		window.addEventListener('resize', (() => {
			this.updateSize()
		}).bind(this));

		if (this.options.animation_enable) {
			this.all_card_animation_position = [];
			/** 存储定位卡的坐标点，用于动画平滑 */
			document.addEventListener("visibilitychange", this._handleVisibilityChange.bind(this));
			/** 处理浏览器切换事件 */
			document.addEventListener('pause', this._handleAppPause.bind(this));
			/** 处理浏览器暂停事件 */
			document.addEventListener('resume', this._handleAppResume.bind(this));                         /** 处理浏览器继续事件 */
		}
	};


	openFPS() {
		this.stats = new Stats();
		if (this.dom !== null)
			this.dom.appendChild(this.stats.dom);
	}

	closeFPS() {
		if (this.dom !== null)
			this.dom.removeChild(this.stats.dom);
	}


	private _animation = (time?:number) => {
		this.renderer.setClearColor( 0xffffff, 0.0 );
		this.renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight )
		/** 渲染fbx模型的动画 */
		// for (let i in this.mixers) {
		// 	this.mixers[i].update(this.mixers[i].clock.getDelta());
		// }


		/** 更新被选中模型的屏幕坐标 */
		// this._updateSelectModelScreenCoor.call(this);
		this.controls.update();
		// (this.label_renderer as any).render(this.scene, this.camera);
		TWEEN.update();
		this.renderer.render(this.scene, this.camera);
		// console.log(this.renderer.info)

		// if (this.options.open_little_map) {
		// 	this.removeGroupChildren(this.track_line_group);
		// 	this.renderer.setClearColor(0xffffff);
		// 	this.renderer.clearDepth(); // important!
		// 	this.renderer.setScissorTest( true );
		// 	this.renderer.setScissor( 20, 20, this.dom!.clientWidth/4, this.dom!.clientHeight/4 );
		// 	this.renderer.setViewport( 20, 20, this.dom!.clientWidth/4, this.dom!.clientHeight/4 );
		// 	// (this.track_material as any).resolution.set( this.dom!.clientWidth/4, this.dom!.clientHeight/4 ); // resolution of the inset viewport
		// 	this.renderer.render( this.scene, this.over_view_camera );
		// 	this.renderer.setScissorTest( false );
		// }

		// this.stats.update();

		// /** 更新定位卡动画 */
		// if (this.options.animation_enable) {
		// 	/** 根据两帧之间的时间差，来更新下一帧卡的位置 */
		// 	if (this.last_animation_time != undefined && time != undefined) {
		// 		this._updateAllCardPosition(time - this.last_animation_time);
		// 	}
		// 	this.last_animation_time = time;
		// }


		// /** 更新轨迹 */
		// this._updateCardTrack();

		// /** 更新定位卡聚类 */
		// if (this.options.cluster_enable && this.update_count >= 20) {
		// 	this._updateCardCluster();
		// 	this.update_count = 0;
		// }

		// if (this.options.cluster_enable) {
		// 	this._updateCardClusterLabel();
		// }

		// if (this.flash_count >= 60 / (this.options.flash_speed as number)) {

		// 	/** 闪烁卡 */
		// 	for (let i in this.all_flash_card) {
		// 		if (this._select_card_id == parseInt(i)) continue;

		// 		if (this.all_flash_card[i].emissive == this.options.flash_color_1) {
		// 			this.all_flash_card[i].material.emissive.setHex(this.options.flash_color_2);
		// 			this.all_flash_card[i].emissive = this.options.flash_color_2;
		// 		} else {
		// 			this.all_flash_card[i].material.emissive.setHex(this.options.flash_color_1);
		// 			this.all_flash_card[i].emissive = this.options.flash_color_1;
		// 		}
		// 	}

		// 	/** 闪烁区域 */
		// 	for (let i in this.all_flash_zone_list) {
		// 		if (this.flash_zone_material.color.getHex() == this.options.flash_color_1) {
		// 			this.flash_zone_material.color.setHex(this.options.flash_color_2 as number);
		// 		} else {
		// 			this.flash_zone_material.color.setHex(this.options.flash_color_1 as number);
		// 		}
		// 		break;
		// 	}

		// 	this.flash_count = 0;
		// }

		// this.flash_count++;
		// this.update_count++;
		// /** 更新第三人称跟随的摄像头位置 */
		// if (this.third_person_card) this._updateThirdPersonCamera();

		this.next_frame_request = requestAnimationFrame(this._animation);
	}
	/**
	 * 更新被选中模型的屏幕坐标
	 *
	 * @ignore
	 */
	private _updateSelectModelScreenCoor = () => {
		if (!this._click_select_obj) return;
		let click_model_position = this._click_select_obj.position.clone();
		let model_height = this._click_select_obj.model_height;

		if ((this._click_select_obj as any)?.isSkinnedMesh) {
			if ((this._click_select_obj as any).parent && this.all_card[(this._click_select_obj as any).parent.model_id]) {
				click_model_position = (this._click_select_obj as any).parent.position.clone();
				model_height = (this._click_select_obj as any).parent.model_height;
			}
		}

		let model_position = {x: click_model_position.x, y: -1 * click_model_position.z, z: click_model_position.y};

		click_model_position.y += model_height as number;

		let event = {
			position: model_position,
			screen_coord: this.positionToScreenXY(click_model_position)
		};

		this.dispatchEvent(EVENTS.UPDATESELECTEDMODELPOSITION, event);
	}

	/**
	 * 移动地图文件中的灯光，场景等children
	 *
	 * @ignore
	 */
	_moveChildrenToScene = (map_file_scene:THREE.Scene) => {
		while (map_file_scene.children && map_file_scene.children.length > 0) {
			let obj = map_file_scene.children[0];
			if (obj.type == 'Light' || obj.type == 'Mesh') {
				this.map_group.add(obj);
			} else if (obj.type == 'Group' && obj.children.length > 0) {
				this.map_group.add(obj);
			}else {
				// map_file_scene.children.shift();
				map_file_scene.remove(obj);
			}
		}
	};

	private _handleMapFileLoadFinish = (data: string | ArrayBuffer) => {
		if (typeof data !== "string") {
			throw new Error("map file data should be string");
		}

		let map_data_json = JSON.parse(data);
		this.target = new THREE.Vector3();

		if (map_data_json.center) {
			this.target = new THREE.Vector3(map_data_json.center.x, map_data_json.center.y, map_data_json.center.z);
		}

		if (map_data_json.camera) {
			this.camera.copy(this.object_loader.parse(map_data_json.camera));
			this.camera.aspect = (this.dom as HTMLElement).clientWidth / (this.dom as HTMLElement).clientHeight;
			this.camera.updateProjectionMatrix();
		}

		this.init_camera_position = this.camera.position.clone();
		this.init_target_position = this.target.clone();
		this.controls.target = this.target;
		this.controls.update();
		this.controls.saveState();

		// this.removeGroupChildren(this.map_group);

		this.object_loader.parse(map_data_json.scene, (obj:any) => {
			/**将灯光，场景等children移到场景中*/
			this._moveChildrenToScene(obj);

			/**复制地图文件上的场景属性*/
			this.scene.fog = obj.fog;
			this.scene.overrideMaterial = obj.overrideMaterial;
			this.scene.autoUpdate = obj.autoUpdate;
			this.scene.background = obj.background;
			/**创建小地图*/
			if (this.options.open_little_map) {
				this._createOverviewMap();
			}
			this._animation();
			/**触发场景初始化完成事件*/
			this.dispatchEvent(EVENTS.SCENELOAD, {progress: 1, data: data})
		});
	}

	/**
	 * 去除小地图场景中其它的mesh
	 *
	 * @ignore
	 */
	emptyScene = (value:THREE.Group) => {
		for (let i = value.children.length - 1; i >= 0; i--) {
			let obj = value.children[i];
			if (obj.type == 'Mesh') {
				value.remove(obj);
				(obj as THREE.Mesh).geometry.dispose();

				// 材质可能有多个
				if (Array.isArray((obj as THREE.Mesh).material)) {
					for (let i in (obj as THREE.Mesh).material) {
						(obj as THREE.Mesh).material[i].dispose();
					}
				} else {
					((obj as THREE.Mesh).material as Material).dispose();
				}
				continue;
			} else if (obj.type == 'Light') {
				value.remove(obj);
				continue;
			}

			if (obj.type == "Group") this.emptyScene(obj as THREE.Group);
		}

		if (value.type == "Group" && value.children.length == 0) value.parent?.remove(value);
	}

	/**
	 * 根据加载的场景，生成小地图的顶视图图片，作为小地图的场景
	 *
	 * @ignore
	 */
	private _createOverviewMap = () => {
		// 创建小地图正交摄像机
		let tmp_box = new THREE.BoxHelper(this.scene);
		tmp_box.geometry.computeBoundingBox();	

		/**整个场景的宽高*/
		let map_width = ((tmp_box.geometry.boundingBox as THREE.Box3).max.x - (tmp_box.geometry.boundingBox as THREE.Box3).min.x);
		let map_height = ((tmp_box.geometry.boundingBox as THREE.Box3).max.z - (tmp_box.geometry.boundingBox as THREE.Box3).min.z);
		/**整个场景俯视图的中心位置*/
		let map_center_x = ((tmp_box.geometry.boundingBox as THREE.Box3).max.x + (tmp_box.geometry.boundingBox as THREE.Box3).min.x) / 2;
		let map_center_z = ((tmp_box.geometry.boundingBox as THREE.Box3).max.z + (tmp_box.geometry.boundingBox as THREE.Box3).min.z) / 2;
		let map_center_y = ((tmp_box.geometry.boundingBox as THREE.Box3).max.y + (tmp_box.geometry.boundingBox as THREE.Box3).min.y) / 2;
		let box_max_y = (tmp_box.geometry.boundingBox as THREE.Box3).max.y;


		this.over_view_camera = new THREE.OrthographicCamera(-map_width/2,map_width/2,map_height/2,-map_height/2, 0.1, 10000);
		this.over_view_camera.position.set(map_center_x, box_max_y + 10, map_center_z);
		this.over_view_camera.lookAt(new THREE.Vector3(map_center_x, map_center_y, map_center_z));
		this.over_view_camera.updateProjectionMatrix();
	}


	private _handleMapFileLoadProgress = (data:object) => {
		console.log(data);
	}

	private _handleMapFileLoadErr() {}


	disposeNode(parentObject:Object3D) {
		parentObject.traverse(function (node) {
			if (node instanceof THREE.Mesh) {
				if (node.geometry) {
					node.geometry.dispose();
				}
				if (node.material) {
					var materialArray;
					if(node.material instanceof Array) {
						materialArray = node.material;
					}
					if(materialArray) {
						materialArray.forEach(function (mtrl, idx) {
							if (mtrl.map) mtrl.map.dispose();
							if (mtrl.lightMap) mtrl.lightMap.dispose();
							if (mtrl.bumpMap) mtrl.bumpMap.dispose();
							if (mtrl.normalMap) mtrl.normalMap.dispose();
							if (mtrl.specularMap) mtrl.specularMap.dispose();
							if (mtrl.envMap) mtrl.envMap.dispose();
							mtrl.dispose();
						});
					}
					else {
						if (node.material.map) node.material.map.dispose();
						if (node.material.lightMap) node.material.lightMap.dispose();
						if (node.material.bumpMap) node.material.bumpMap.dispose();
						if (node.material.normalMap) node.material.normalMap.dispose();
						if (node.material.specularMap) node.material.specularMap.dispose();
						if (node.material.envMap) node.material.envMap.dispose();
						node.material.dispose();
					}
				}
			}
		});
	}

	/**
	 * 清空Group的Children，如果是mesh还需要dispose操作
	 *
	 * @ignore
	 */
	 removeGroupChildren = (group:THREE.Group) => {
		while (group.children.length > 0) {
			let obj = group.children[0];

			if (obj.type == 'Mesh') {
				(obj as THREE.Mesh).geometry.dispose();
				// 材质可能有多个
				if (Array.isArray((obj as THREE.Mesh).material)) {
					for (let i in (obj as THREE.Mesh).material) {
						if ((obj as THREE.Mesh).material[i].map) (obj as THREE.Mesh).material[i].map.dispose();
						if ((obj as THREE.Mesh).material[i].lightMap) (obj as THREE.Mesh).material[i].lightMap.dispose();
						if ((obj as THREE.Mesh).material[i].bumpMap) (obj as THREE.Mesh).material[i].bumpMap.dispose();
						if ((obj as THREE.Mesh).material[i].normalMap) (obj as THREE.Mesh).material[i].normalMap.dispose();
						if ((obj as THREE.Mesh).material[i].specularMap) (obj as THREE.Mesh).material[i].specularMap.dispose();
						if ((obj as THREE.Mesh).material[i].envMap) (obj as THREE.Mesh).material[i].envMap.dispose();

						(obj as THREE.Mesh).material[i].dispose();
					}
				} else {
					if (((obj as THREE.Mesh).material as THREE.MeshBasicMaterial).map) {
						((obj as THREE.Mesh).material as THREE.MeshBasicMaterial).map?.dispose();
					}
					if (((obj as THREE.Mesh).material as any).lightMap) {
						((obj as THREE.Mesh).material as any).lightMap.dispose();
					}
					if (((obj as THREE.Mesh).material as any).bumpMap) {
						((obj as THREE.Mesh).material as any).bumpMap.dispose();
					}
					if (((obj as THREE.Mesh).material as any).normalMap) {
						((obj as THREE.Mesh).material as any).normalMap.dispose();
					}
					if (((obj as THREE.Mesh).material as any).specularMap) {
						((obj as THREE.Mesh).material as any).specularMap.dispose();
					}
					if (((obj as THREE.Mesh).material as any).envMap) {
						((obj as THREE.Mesh).material as any).envMap.dispose();
					}
					((obj as THREE.Mesh).material as THREE.MeshBasicMaterial).dispose();
				}
			} else if (obj.type == 'Group' && obj.children.length > 0) {
				this.removeGroupChildren(obj as THREE.Group);
			}
			group.remove(obj);
		}
	}
	/**
	 * 加载JSON模型,根据key保存在all_model之中
	 *
	 * @ignore
	 * @param {String} url 模型的路径
	 * @param {String} key 模型存储的key
	 * @return {Boolean}    返回操作结果
	 */
	_loadJsonModel = (url:string, key:string) => {
		if (this.all_model[key]) {
			console.error("已经存在key相同的模型");
			return false;
		}
		this.object_loader.load(url,
			 (object:NonNullable<typeof this._click_select_obj>) => {
				object.model_type = "json";
				object.model_height = this._calculateModelHeight(object);       /* 需要计算模型的高度，模型高度在计算屏幕位置时要用到 */
				this.all_model[key] = object;
				this.dispatchEvent(EVENTS.LOADMODELFINISH, {key: key, data: object});
			},
			(xhr:any) => {
				this.dispatchEvent(EVENTS.LOADMODEL, {progress: xhr.loaded / xhr.total * 100});
			},
			function (error) {
				console.log(error)
			}
		)
	};
	/**
	 * 计算模型的高度
	 *
	 * @ignore
	 * @param {Object}  模型
	 * @return {Number}    返回操作结果
	 */
	private _calculateModelHeight = (jsonModel:Object3D) => {
		let tmp_box = new THREE.BoxHelper(jsonModel);
		tmp_box.update();
		tmp_box.geometry.computeBoundingBox();
		return (tmp_box.geometry.boundingBox as THREE.Box3).max.y - (tmp_box.geometry.boundingBox as THREE.Box3).min.y;
	}
	/**
	 * 加载FBX模型,根据key保存在all_model之中
	 *
	 * @ignore
	 * @param {String} url 模型的路径
	 * @param {String} key 模型存储的key
	 * @return {Boolean}    返回操作结果
	 */
	private _loadFBXModel = (url:string, key:string) => {
		if (this.all_model[key]) {
			console.error("已经存在key相同的模型");
			return false;
		}

		if (this.fbx_loader == undefined) this.fbx_loader = new FBXLoader();

		this.fbx_loader.load(url,
			((object:NonNullable<typeof this._click_select_obj>) => {
				object.model_format = "fbx";
				object.model_height = this._calculateModelHeight(object);
				this.all_model[key] = object;
				this.dispatchEvent(EVENTS.LOADMODELFINISH, {key: key, data: object});
			}).bind(this),
			((xhr:any) => {
				this.dispatchEvent(EVENTS.LOADMODEL, {progress: xhr.loaded / xhr.total * 100});
			}).bind(this),
			(error:ErrorEvent) => {
				console.error(error)
			});
	};
	/**
	 * 加载GLTF模型,根据key保存在all_model之中
	 *
	 * @ignore
	 * @param {String} url 模型的路径
	 * @param {String} key 模型存储的key
	 * @return {Boolean}    返回操作结果
	 */

	private _loadGLTFModel = (url:string, key:string) => {
		if (this.all_model[key]) {
			console.error("已经存在key相同的模型");
			return false;
		}
		if (this.gltf_loader == undefined) this.gltf_loader = new GLTFLoader();

		this.gltf_loader.load(url,
			((object:any) => {
				object.model_format = "gltf";
				object.model_height = this._calculateModelHeight(object);
				this.all_model[key] = object;
				console.log(object);
			}).bind(this),
			((xhr:any) => {
				this.dispatchEvent(EVENTS.LOADMODEL, {progress: xhr.loaded / xhr.total * 100});
			}).bind(this),
			function (error:ErrorEvent) {
				console.log(error);
			});
	}
	/**
	 * 兼容之前的接口
	 * 加载JSON模型,根据key保存在all_model之中
	 *
	 * @param {String} url 模型的路径
	 * @param {String} key 模型存储的key
	 * * @param {String} type 模型的格式
	 * @return {Boolean}    返回操作结果
	 */
	loadModel = (url:string, key:string, type:string) => {
		if (this.all_model[key]) {
			console.error("已经存在key相同的模型");
			return false;
		}
		switch (type) {
			case "json":
				this._loadJsonModel(url, key);
				break;
			case "fbx":
				this._loadFBXModel(url, key);
				break;
			case "glb":
			case "gltf":
				this._loadGLTFModel(url, key);
				break;
			default:
				console.error("暂不支持该格式的模型");
				break;
		}
	};
	/**
	 * 往地图上添加静态模型
	 *
	 * @param {Number} model_id 模型存储的ID
	 * @param {String} static_model_key 加载模型的key
	 * @param {String} model_type 模型类型
	 * @param {Number} model_x 模型的位置x
	 * @param {Number} model_y 模型的位置y
	 * @param {Number} model_z 模型的位置z
	 * @param {Object} options 可选参数
	 * @param {String} options.text 显示的文字
	 * @param {String} options.text_class 文字容器dom元素的class
	 * @return {Boolean} 操作是否成功
	 */
	addStaticModel = (model_id:number, static_model_key:string, model_type:string, model_x:number, model_y:number, model_z:number, options?:{text?:string,text_class?:string}) => {
		if (isNaN(model_id) || isNaN(model_x) || isNaN(model_y) || isNaN(model_z)) {
			console.error("参数错误，model_id，model_x，model_y，model_z必须为数字");
			return false;
		}

		let internal_user_costom_model_key = "model_" + model_id + "_" + model_type;

		if (this.all_user_custom_model[internal_user_costom_model_key]) {
			this.all_user_custom_model[internal_user_costom_model_key].model_height = (this.all_model as any)[static_model_key].model_height;
			this.all_user_custom_model[internal_user_costom_model_key].model_type = model_type;
			this.all_user_custom_model[internal_user_costom_model_key].model_id = model_id;
			this.all_user_custom_model[internal_user_costom_model_key].position.set(model_x, model_z, -model_y);
			return true;
		}
		if (this.all_model[static_model_key] === undefined) {
			console.error("错误的static_model_key，没有该模型");
			return false;
		}

		let model = this.all_model[static_model_key].clone();
		model.name = internal_user_costom_model_key;
		model.model_height = this.all_model[static_model_key].model_height;
		model.model_type = model_type;
		model.model_id = model_id;
		model.position.set(model_x, model_z, -model_y);

		/* 创建文字对象 */
		if (options && options.text) {
			let labelDiv = document.createElement('div');
			labelDiv.classList.add('label');

			if (options.text_class) {
				labelDiv.classList.add(options.text_class);
			}

			labelDiv.innerHTML = options.text;
			let label = new CSS2DObject(labelDiv);
			label.position.set(0, model.model_height as number, 0);
			model.add(label);
			model.label = label
		}

		this.all_model_in_the_scene.add(model);
		this.all_user_custom_model[internal_user_costom_model_key] = model;
	};
	/**
	 * 设置指定静态模型的文字label
	 * @param {Number} model_id 模型存储的ID
	 * @param {String} model_type 模型类型
	 * @param {String} text 文字
	 * @param {Object} options 可选参数
	 * @param {String} options.remove_text_class 需要去除的文字容器dom元素class
	 * @param {String} options.add_text_class 需要添加的文字容器dom元素class
	 * @return {Boolean}    返回操作结果
	 */
	setStaticModelText = (model_id:number, model_type:string, text:string, options?:{remove_text_class?:string,add_text_class?:string}) => {
		options = options ? options : {};
		if (isNaN(model_id)) {
			console.error("参数错误，model_id必须为数字");
			return false;
		}
		if (!model_type) {
			console.error("参数错误，model_type必填参数");
			return false;
		}

		let internal_user_costom_model_key = "model_" + model_id + "_" + model_type;

		if (this.all_user_custom_model[internal_user_costom_model_key]) {
			let model = this.all_user_custom_model[internal_user_costom_model_key];

			if (model.label) {
				if (text) {
					model.label.element.innerHTML = text;
				}

				/* 去掉要移除的class */
				if (options.remove_text_class) {
					model.label.element.classList.remove(options.remove_text_class);
				}

				if (options.add_text_class) {
					model.label.element.classList.add(options.add_text_class);
				}

			} else {
				let labelDiv = document.createElement('div');
				labelDiv.classList.add('label');
				if (options.add_text_class) {
					labelDiv.classList.add(options.add_text_class);
				}
				labelDiv.innerHTML = text;
				let label = new CSS2DObject(labelDiv);
				label.position.set(0, model.model_height, 0);
				model.add(label);
				model.label = label
			}
			return true;
		} else {
			console.error("不存在该静态模型");
			return false;
		}
	}
	/**
	 * 删除添加的静态模型
	 * @param {Number} model_id 模型存储的ID
	 * @param {String} model_type 模型类型
	 * @return {Boolean}    返回操作结果
	 */
	removeStaticModel = (model_id:number, model_type:string) => {
		if (isNaN(model_id)) {
			console.error("参数错误，model_id必须为数字");
			return false;
		}
		if (!model_type) {
			console.error("参数错误，model_type必填参数");
			return false;
		}

		let internal_user_costom_model_key = "model_" + model_id + "_" + model_type;

		if (this.all_user_custom_model[internal_user_costom_model_key]) {
			let user_custom_model = this.all_user_custom_model[internal_user_costom_model_key];
			this.all_model_in_the_scene.remove(user_custom_model);
			delete this.all_user_custom_model[internal_user_costom_model_key];

			/* 销毁文字对象 */
			if (user_custom_model.label) {
				user_custom_model.label.destroy();
			}

			user_custom_model.material.dispose();
			user_custom_model.geometry.dispose();
		} else {
			console.error("不存在该静态模型");
			return false;
		}
	};

	/**
	 * 删除所有添加的静态模型
	 * @return {Boolean}    返回操作结果
	 */
	removeAllStaticModel = () => {
		for (let i in this.all_user_custom_model) {
			this.all_model_in_the_scene.remove(this.all_user_custom_model[i]);

			/* 销毁文字对象 */
			if (this.all_user_custom_model[i].label) {
				this.all_user_custom_model[i].label.destroy();
			}

			this.all_user_custom_model[i].material.dispose();
			this.all_user_custom_model[i].geometry.dispose();
		}
		this.all_user_custom_model = [];
		return true;
	};

	/**
	 * 重置地图
	 * @param {Object}  区域id
	 * @return {Boolean}   返回是否成功
	 */
	reset = () => {

		/** 移除所有定位卡，基站，自定义模型 */
		this.removeGroupChildren(this.all_model_in_the_scene);

		/** 移除所有区域 */
		this.removeGroupChildren(this.area_group);

		/** 移除阴影 */
		if (this.options.open_shadow) {
			this.removeGroupChildren(this.shadow_group);
		}

		/** 移除所有的轨迹 */
		this.removeGroupChildren(this.track_line_group);

		// 删除之前的地图模型
		this.removeGroupChildren(this.map_group);

		// this.disposeNode(this.scene);

		/** 移除所有的label文字 */
		for (let i in this.all_card) {
			if (this.all_card[i].label) {
				this.all_card[i].label.destroy();
			}
		}

		/** 移除所有自定义静态模型的label文字 */
		for (let i in this.all_user_custom_model) {
			if (this.all_user_custom_model[i].label) {
				this.all_user_custom_model[i].label.destroy();
			}
		}

		this.stopPatrol();

		this.stopThirdPersonFollow();

		this.stopFollowCard();


		/* 涉及的变量重置为初始值 */
		this.all_zone_list = [];                   /* 所有的区域对象 */
		this.all_zone_edge_line = [];                   /* 所有的区域边线对象 */

		this.mixers = [];                    /* fbx模型的动画 */

		this.all_shadow_model = [];                   /* 所有的阴影模型 */
		// this.all_overview_card = [];                   /* 所有的小地图对象 */

		this.all_card = [];                   /* 定位卡 */
		this.all_flash_card = [];                   /* 所有闪烁的定位卡 */
		this.all_card_animation_position = [];                   /* 定位卡的动画缓存的点 */

		this.all_track_card = [];                   /* 需要轨迹的卡号 */
		this.all_track_card_is_show = [];                   /* 该卡号轨迹是否需要显示 */
		this.all_track_color = [];                   /* 控制轨迹的颜色 */
		this.all_track_card_position = {};                   /* 存储轨迹追踪的卡的历史点 */
		// this.all_track_point_count = [];                   /* 轨迹目前的点数量 */

		this.all_base_station_model = [];                   /* 基站对象 */
		this.all_user_custom_model = [];                   /* 用户添加的模型 */
		if (this.options.animation_enable) {
			this.all_card_animation_position = [];          /* 存储定位卡的坐标点，用于动画平滑 */
		}
	};

	/**
	 * 停止跟随定位卡
	 * @return {Boolean}   返回是否成功
	 */
	stopFollowCard = () => {
		if (this.camera_tween) {
			this.camera_tween.stop();
			TWEEN.remove(this.camera_tween);
			this.camera_tween = undefined;
		}

		// if (this.target_tween) {
		// 	this.target_tween.stop();
		// 	TWEEN.remove(this.target_tween);
		// 	this.target_tween = null;
		// }

		this.now_patrol_card = undefined;
		this.controls.enabled = true;
	};


	/**
	 * 切换地图
	 * @param {String} scene_url 场景文件的加载路径
	 * @return {Boolean}   返回是否成功
	 */
	changeScene = (scene_url:string) => {
		if (scene_url == undefined) {
			console.error("需要指定场景文件路径");
			return false;
		}

		this.reset();

		cancelAnimationFrame(this.next_frame_request);
		this.scene_url = scene_url;

		this.file_loader.load(
			this.scene_url,
			this._handleMapFileLoadFinish,
			this._handleMapFileLoadProgress,
			this._handleMapFileLoadErr
		);
	};
	parallelTraverse = (a:THREE.Object3D, b:THREE.Object3D, callback:Function) => {
		callback(a, b);
		for (let i = 0; i < a.children.length; i++) {
			this.parallelTraverse(a.children[i], b.children[i], callback);
		}
	}
	/**
	 * 克隆FBX模型
	 *
	 * @ignore
	 * @param {Object}  模型
	 * @return {Number}    返回FBX模型
	 */
	 FbxClone = (source:THREE.Group) => {
		let cloneLookup = new Map();
		let clone = source.clone();
		this.parallelTraverse(source, clone, function (sourceNode:any, clonedNode:any) {
			cloneLookup.set(sourceNode, clonedNode);
		});

		source.traverse(function (sourceMesh:any) {
			if (!sourceMesh.isSkinnedMesh) return;
			var sourceBones = sourceMesh.skeleton.bones;
			var clonedMesh = cloneLookup.get(sourceMesh);
			clonedMesh.skeleton = sourceMesh.skeleton.clone();
			clonedMesh.skeleton.bones = sourceBones.map(function (sourceBone:any) {
				if (!cloneLookup.has(sourceBone)) {
					throw new Error('THREE.AnimationUtils: Required bones are not descendants of the given object.');
				}
				return cloneLookup.get(sourceBone);
			});
			clonedMesh.bind(clonedMesh.skeleton, sourceMesh.bindMatrix);
		});
		clone.animations = source.animations;
		(clone as any).model_height = (source as any).model_height;
		return clone;
	}
	/**
	 * 获得fbx模型的SkinnedMesh
	 *
	 * @ignore
	 * @param {Object}  模型
	 * @return {Object} 返回SkinnedMesh
	 */
	getFBXModelSkinnedMesh = (fbxModel:any) => {
		for (let i = 0; i < fbxModel.children.length; i++) {
			if (fbxModel.children[i].type == "SkinnedMesh") {
				return fbxModel.children[i];
			}
		}
	}
	/**
	 * 添加定位卡信息
	 *
	 * @param {Number} card_id 标签卡的卡号
	 * @param {Number} card_x 定位坐标x
	 * @param {Number} card_y 定位坐标y
	 * @param {Number} card_z 定位坐标z
	 * @param {String} key 标签卡的模型的key
	 * @param {Object} options 可选参数
	 * @param {String} options.text 显示的文字
	 * @param {String} options.text_class 文字容器dom元素的class
	 * @return {Boolean}   返回是否成功
	 */
	addCardInfo = (card_id:number, card_x:number, card_y:number, card_z:number, key:string, options?:any, is_track?:boolean) => {
		let card_id_number = card_id;
		let card_x_number = card_x;
		let card_y_number = card_y;
		let card_z_number = card_z;
		let model_key = key ? key : "card";

		if (isNaN(card_id_number) || isNaN(card_x_number) || isNaN(card_y_number) || isNaN(card_z_number)) {
			console.error("addCardInfo 参数类型错误");
			return false;
		}

		if (this.all_model[model_key] === undefined) {
			console.error("该模型还未加载，请先加载模型");
			return false;
		}

		if (this.all_card[card_id_number] !== undefined) {
			console.error("该卡已经添加");
			return false;
		}

		let card_object:{
			card_id:number,
			card_x:number,
			card_y:number,
			card_z:number,
			model?:THREE.Object3D,
			model_format?:string,
			model_height?:number,
			label?:CSS2DObject,
			start_time?:number,
			is_start_animation?:boolean,
			is_need_update_rotation?:boolean,

		} = {
			card_id: card_id_number,
			card_x: card_x_number,
			card_y: card_z_number,
			card_z: -card_y_number,
		};

		/** 保存用来创建小地图会用到的模型材质 */
		let card_model_material = undefined;

		/**
		 * 针对fbx和json模型分别做处理
		 * 后期如果同意模型格式可以简化该部分逻辑
		 * 在updateCardModel存在一样的逻辑，修改时需要注意两部分都需要修改
		 * */
		if (this.all_model[model_key].model_format === "fbx") {

			let fbx_model = this.FbxClone(this.all_model[model_key] as THREE.Group);

			/** 针对fbx模型的动画等处理 */
			(fbx_model as any).mixer = new THREE.AnimationMixer(fbx_model);
			(fbx_model as any).mixer.clock = new THREE.Clock();
			this.mixers[card_id_number] = (fbx_model as any).mixer;
			this.mixers[card_id_number].timeScale = 0.01;
			let action = (fbx_model as any).mixer.clipAction(fbx_model.animations[0]);
			action.play();

			let skinned_mesh = this.getFBXModelSkinnedMesh(fbx_model);

			card_model_material = skinned_mesh.material;
			fbx_model.position.set(card_x_number, card_z_number, -card_y_number);
			(fbx_model as any).model_id = card_id_number;
			(fbx_model as any).model_type = 1;

			if (options && options.scale) {
				fbx_model.scale.x = options.scale;
				fbx_model.scale.y = options.scale;
				fbx_model.scale.z = options.scale;
			}

			skinned_mesh.init_emissive_color = skinned_mesh.material.emissive.getHex();

			this.all_model_in_the_scene.add(fbx_model);

			(card_object).model = fbx_model;
			(card_object).model_format = "fbx";
			(card_object).model_height = (fbx_model as any).model_height;
		} else if (this.all_model[model_key].model_type === "json") {      /* json模型的处理和其余json模型几乎一样，可以考虑封装函数统一处理 */
			let json_model = this.all_model[model_key].clone();

			card_model_material = (json_model as THREE.Mesh).material;
			json_model.position.set(card_x_number, card_z_number, -card_y_number);
			json_model.model_id = card_id_number;
			json_model.model_type = '1';
			if (options && options.scale) {
				json_model.scale.x = options.scale;
				json_model.scale.y = options.scale;
				json_model.scale.z = options.scale;
			}
			(json_model as any).init_emissive_color = (json_model as any).material.emissive.getHex();
			json_model.model_height = this.all_model[model_key].model_height;           /* clone无法克隆自定义的属性，除fbx模型外，其它模型的高度都存储在模型本身 */

			this.all_model_in_the_scene.add(json_model);

			(card_object).model = json_model;
			(card_object).model_format = "json";
			(card_object).model_height = json_model.model_height as number;
		} else if (this.all_model[model_key].model_type === "gltf") {

		}

		/* 创建文字对象 */
		if (options && options.text) {
			let labelDiv = document.createElement('div');
			labelDiv.classList.add('label');

			if (options.text_class) {
				labelDiv.classList.add(options.text_class);
			}

			labelDiv.innerHTML = options.text;
			let label = new CSS2DObject(labelDiv);
			label.position.set(0, (card_object).model_height as number, 0);
			(card_object).model?.add(label);
			(card_object).label = label
		}


		this.all_card[card_id_number] = card_object;

		if (this.options.animation_enable) {
			(card_object).start_time = new Date().getTime();
			(card_object).is_start_animation = false;
			(card_object).is_need_update_rotation = true;
			this.all_card_animation_position[card_id_number] = []
		}

		/* 如果打开了小地图，需要在小地图上添加定位图标 */
		if (this.options.open_little_map) {
			/* 创建一个边长为1的正三角形 */
			let geometry = new THREE.BufferGeometry();

			const vertices = new Float32Array([
				-0.5, 0, 0,
				0, 0, Math.sqrt(0.75),
				0.5, 0, 0
			]);


			geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
			let cube = new THREE.Mesh(geometry, card_model_material);
			cube.position.set(card_x_number, 0.01, -card_y_number);
			// if (this.overview_map_card_scale) {
			// 	cube.scale.set(this.overview_map_card_scale, this.overview_map_card_scale, this.overview_map_card_scale)
			// }
			// this.overview_card_group.add(cube);
			// this.all_overview_card[card_id_number] = cube;
		}

		// 是否添加到轨迹信息
		if (is_track) {
			this.addTrack(card_id);
			if (this.all_track_card[card_id_number]) {
				this._addTrackCardPositiondata(card_id_number, card_x_number, card_z_number, -card_y_number,false);
			}
		}

		/* 如果打开了阴影显示，需要添加阴影模型 */
		if (this.options.open_shadow && this.all_model["shadow"]) {
			let shadow_model = this.all_model["shadow"].clone();
			shadow_model.position.set(card_x_number, 0.001, -card_y_number);
			this.shadow_group.add(shadow_model);
			this.all_shadow_model[card_id_number] = shadow_model;
		}
	};

	/**
	 * 计算定位卡移动到下一个点的旋转角度
	 *
	 * @ignore
	 */
	private _getNextPointRotate = (now_position:{x:number,y:number,z:number}, next_position:{x:number,y:number,z:number}) => {
		let dist = (now_position.x - next_position.x) * (now_position.x - next_position.x) + (now_position.z - next_position.z) * (now_position.z - next_position.z);
		let flag = 1;

		if (next_position.x - now_position.x < 0) {
			flag = -1;
		}

		if (dist > 0) {
			return flag * (Math.acos((next_position.z - now_position.z) / Math.sqrt(dist)));
		}

		return 0;
	}

	/**
	 * 轨迹数据增加一个点
	 *
	 * @ignore
	 */
	_addTrackCardPositiondata = (card_id_number:number, x:number, y:number, z:number, is_animation:boolean) => {
		if (!is_animation) {
			if (this.all_track_card_position[card_id_number] == undefined) {
				this.all_track_card_position[card_id_number] = [{x: x, y: y, z: z}]
			} else {
				this.all_track_card_position[card_id_number]!.push({x: x, y: y, z: z});
				if (this.all_track_card_position[card_id_number]!.length > (this.options.track_position_length as number)) {
					this.all_track_card_position[card_id_number]!.shift();
				}
			}
		} 
		
		if (this.all_track_card_animation[card_id_number] == undefined) {
			this.all_track_card_animation[card_id_number] = [{x: x, y: y, z: z}]
		} else {
			this.all_track_card_animation[card_id_number]!.push({x: x, y: y, z: z});
			if (this.options.animation_enable && this.all_track_card_animation[card_id_number]!.length > (this.options.track_animation_length as number)) {
				this.all_track_card_animation[card_id_number]!.shift();
			}else if (!this.options.animation_enable && this.all_track_card_animation[card_id_number]!.length > (this.options.track_position_length as number)) {
				this.all_track_card_animation[card_id_number]!.shift();
			}
		}
	};

	/**
	 * 更新定位卡坐标
	 *
	 * @param {Number}  card_id 标签卡的卡号
	 * @param {Number}  card_x 定位坐标x
	 * @param {Number}  card_y 定位坐标y
	 * @param {Number}  card_z 定位坐标z
	 * @return {Boolean}   返回是否成功
	 */
	updateCardCoordinate = (card_id:number, card_x:number, card_y:number, card_z:number) => {
		let card_id_number = card_id;
		let card_x_number = card_x;
		let card_y_number = card_y;
		let card_z_number = card_z;
		if (isNaN(card_id_number) || isNaN(card_x_number) || isNaN(card_y_number) || isNaN(card_z_number)) {
			console.error("updateCardCoordinate 参数类型错误");
			return false;

		}

		if (this.all_card[card_id_number]) {

			/* 根据是否开启平滑动画，分开处理 */
			if (this.options.animation_enable) {
				if (!this.all_card_animation_position[card_id_number]) this.all_card_animation_position[card_id_number] = [];

				/* 判断新来的定位点，和存储的最后一个定位点是否很近 */
				if (this._getTwoPointLineDistance([this.all_card[card_id_number].card_x, this.all_card[card_id_number].card_y, this.all_card[card_id_number].card_z], [card_x_number, card_z_number, -card_y_number]) < 0.001) {

					/* 如果很近，再根据当前是否有点来做处理 */
					let position_data_len = this.all_card_animation_position[card_id_number].length;
					if (position_data_len > 0) {
						this.all_card_animation_position[card_id_number][position_data_len - 1].time = new Date().getTime();
						return true;
					} else {
						this.all_card[card_id_number].start_time = new Date().getTime();
						return true;
					}
				} else {
					this.all_card_animation_position[card_id_number].push({
						x: card_x_number,
						y: card_z_number,
						z: -card_y_number,
						time: new Date().getTime()
					});
					this.all_card[card_id_number].card_x = card_x_number;
					this.all_card[card_id_number].card_y = card_z_number;
					this.all_card[card_id_number].card_z = -card_y_number;
					return true;
				}
			} else {
				/* 先计算模型移动到下一个点需要旋转的角度 */
				let model_rotate = this._getNextPointRotate(this.all_card[card_id_number].model.position, {
					x: card_x_number,
					y: card_z_number,
					z: -card_y_number
				});
				if (model_rotate) {
					this.all_card[card_id_number].model.rotation.y = model_rotate;
				}

				this.all_card[card_id_number].model.position.set(card_x_number, card_z_number, -card_y_number);
				this.all_card[card_id_number].card_x = card_x_number;
				this.all_card[card_id_number].card_y = card_z_number;
				this.all_card[card_id_number].card_z = -card_y_number;
				this.all_card[card_id_number].start_time = new Date().getTime();

				/* 移动阴影 */
				if (this.options.open_shadow) {
					this.all_shadow_model[card_id_number].position.set(card_x_number, 0, -card_y_number);
				}

				/* 如果开启小地图需要移动小地图的图标 */
				// if (this.options.open_little_map && this.all_overview_card[card_id_number]) {
				// 	//? Z坐标往负方向移动小地图渲染不出来
				// 	this.all_overview_card[card_id_number].position.set(card_x_number, card_z_number, -card_y_number)
				// }

				/* 处理轨迹追踪，需要保持需要轨迹追踪的卡的历史点，并且维持一定长度 */
				if (this.all_track_card[card_id_number]) {
					this._addTrackCardPositiondata(card_id_number, card_x_number, card_z_number, -card_y_number, false);
				}
			}
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 设置定位卡的文字信息
	 *
	 * @param {Number}  card_id 标签卡的卡号
	 * @param {Number}  text 文字内容
	 * @param {Object} options 可选参数
	 * @param {String} options.remove_text_class 需要去除的文字容器dom元素class
	 * @param {String} options.add_text_class 需要添加的文字容器dom元素class
	 * @return {Boolean}   返回是否成功
	 */
	setCardText = (card_id:number, text:string, options?:{remove_text_class?:string,add_text_class?:string}) => {
		options = options ? options : {};
		let card_id_number = card_id;

		if (isNaN(card_id_number)) {
			console.error("setCardText 参数错误");
			return false;
		}

		if (this.all_card[card_id_number]) {
			if (this.all_card[card_id_number].label) {
				if (text !== undefined) {
					this.all_card[card_id_number].label.element.innerHTML = text;
				}

				/** 去掉要移除的class */
				if (options.remove_text_class) {
					this.all_card[card_id_number].label.element.classList.remove(options.remove_text_class);
				}

				if (options.add_text_class) {
					this.all_card[card_id_number].label.element.classList.add(options.add_text_class);
				}

			} else {
				let labelDiv = document.createElement('div');
				labelDiv.classList.add('label');
				if (options.add_text_class) {
					labelDiv.classList.add(options.add_text_class);
				}
				labelDiv.innerHTML = text;
				let label = new CSS2DObject(labelDiv);
				label.position.set(0, this.all_card[card_id_number].model_height, 0);
				this.all_card[card_id_number].model.add(label);
				this.all_card[card_id_number].label = label
			}
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 停止巡视
	 * @return {Boolean}   返回是否成功
	 */
	stopPatrol = () => {
		this.now_patrol_card = undefined;
		if (this.camera_tween) {
			this.camera_tween.stop();
			TWEEN.remove(this.camera_tween);
			this.camera_tween = undefined;
		}

		// if (this.target_tween) {
		// 	this.target_tween.stop();
		// 	TWEEN.remove(this.target_tween);
		// 	this.target_tween = null;
		// }

		this.is_camera_rotate = false;
		this.controls.enabled = true;
		this.controls.autoRotate = false;
		this.controls.update();
	};

	/**
	 * 删除指定定位卡
	 *
	 * @param {Number}  card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	removeCard = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_card[card_id_number]) {
			this.all_model_in_the_scene.remove(this.all_card[card_id_number].model);

			/** 销毁文字对象 */
			if (this.all_card[card_id_number].label) {
				this.all_card[card_id_number].label.destroy();
			}

			if (this.all_card[card_id_number].model_format == "fbx") {
				let skinned_mesh = this.getFBXModelSkinnedMesh(this.all_card[card_id_number].model);
				skinned_mesh.material.dispose();
				skinned_mesh.geometry.dispose();
			} else if (this.all_card[card_id_number].model_format == "json") {
				this.all_card[card_id_number].model.material.dispose();
				this.all_card[card_id_number].model.geometry.dispose();
			}

			/** 去掉fbx模型的动画 */
			if (this.mixers[card_id_number]) {
				delete this.mixers[card_id_number];
			}

			/** 去掉阴影模型 */
			if (this.all_shadow_model && this.all_shadow_model[card_id_number]) {
				this.shadow_group.remove(this.all_shadow_model[card_id_number]);
				this.all_shadow_model[card_id_number].material.dispose();
				this.all_shadow_model[card_id_number].geometry.dispose();
				delete this.all_shadow_model[card_id_number];
			}

			/** 去掉轨迹追踪 */
			if (this.all_track_card && this.all_track_card[card_id_number]) {
				this.removeTrack(card_id_number)
			}

			/** 去掉巡视状态 */
			if (this.now_patrol_card == card_id_number) {
				this.stopPatrol();
			}

			delete this.all_card[card_id_number];

		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 删除全部定位卡
	 *
	 */
	removeAllCard = () => {
		for (let i in this.all_card) {
			this.removeCard(parseInt(i));
		}
	}

	/**
	 * 隐藏指定定位卡
	 *
	 * @param {Number}  card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	hideCard = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_card[card_id_number]) {
			this.all_card[card_id_number].model.visible = false;

			if (this.all_card[card_id_number].label) {
				this.all_card[card_id_number].label.visible = false;
			}

			/** 隐藏阴影模型 */
			if (this.all_shadow_model && this.all_shadow_model[card_id_number]) {
				this.all_shadow_model[card_id_number].visible = false;
			}

			/** 隐藏轨迹 */
			if (this.all_track_card_is_show && this.all_track_card_is_show[card_id_number]) {
				this.all_track_card_is_show[card_id_number] = false
			}
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 显示指定定位卡
	 *
	 * @param {Number}  card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	showCard = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_card[card_id_number]) {
			this.all_card[card_id_number].model.visible = true;
			if (this.all_card[card_id_number].label) {
				this.all_card[card_id_number].label.visible = true;
			}

			/** 显示阴影模型 */
			if (this.all_shadow_model && this.all_shadow_model[card_id_number]) {
				this.all_shadow_model[card_id_number].visible = true;
			}

			/** 显示轨迹 */
			if (this.all_track_card_is_show && this.all_track_card_is_show[card_id_number] === false) {
				this.all_track_card_is_show[card_id_number] = true
			}
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 显示全部定位卡
	 *
	 * @return {Boolean} 返回操作结果
	 */
	showAllCard = () => {
		for (let i in this.all_card) {
			this.all_card[i].model.visible = true;
			if (this.all_card[i].label) {
				this.all_card[i].label.visible = true;
			}

			/** 显示阴影模型 */
			if (this.all_shadow_model && this.all_shadow_model[i]) {
				this.all_shadow_model[i].visible = true;
			}

			/** 显示轨迹 */
			if (this.all_track_card_is_show && this.all_track_card_is_show[i] === false) {
				this.all_track_card_is_show[i] = true
			}
		}
	};

	/**
	 * 隐藏全部定位卡
	 *
	 * @return {Boolean} 返回操作结果
	 */
	hideAllCard = () => {
		for (let i in this.all_card) {
			this.all_card[i].model.visible = false;
			if (this.all_card[i].label) {
				this.all_card[i].label.visible = false;
			}

			/** 隐藏阴影模型 */
			if (this.all_shadow_model && this.all_shadow_model[i]) {
				this.all_shadow_model[i].visible = false;
			}

			/** 隐藏轨迹 */
			if (this.all_track_card_is_show && this.all_track_card_is_show[i]) {
				this.all_track_card_is_show[i] = false
			}
		}
	};

	/**
	 * 开始闪烁定位卡，兼容之前的接口
	 *
	 * @param {Number} card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	addCardTwinkle = (card_id:number) => {
		return this.startCardFlash(card_id);
	};

	/**
	 * 开始闪烁定位卡
	 *
	 * @param {Number} card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	startCardFlash = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_flash_card[card_id_number]) {
			return true;
		}

		if (this.all_card[card_id_number]) {
			let card_model = undefined;
			if (this.all_card[card_id_number].model_format == "fbx") {
				card_model = this.getFBXModelSkinnedMesh(this.all_card[card_id_number].model);
			} else {
				card_model = this.all_card[card_id_number].model;
			}

			if (card_model.independent_material === undefined) {
				card_model.material = card_model.material.clone();
				card_model.independent_material = true;
			}

			// 闪烁仅改变材质的发光颜色，因为小地图的材质和对应的卡的材质是一个，所以不需要再单独处理小地图上定位元素的材质
			if (this._select_card_id != card_id_number) {
				card_model.material.emissive.setHex(this.options.flash_color_1);
			}

			// 保存闪烁信息
			this.all_flash_card[card_id_number] = {
				emissive: this.options.flash_color_1,
				material: card_model.material
			};
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}

	};

	/**
	 * 停止闪烁定位卡
	 *
	 * @param {Number} card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	clearCardTwinkle = (card_id:number) => {
		return this.stopCardFlash(card_id);
	};

	/**
	 * 停止闪烁定位卡
	 *
	 * @param {Number} card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	stopCardFlash = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (!this.all_flash_card[card_id_number]) {
			return true;
		}

		if (this.all_card[card_id_number]) {

			let card_model = undefined;
			if (this.all_card[card_id_number].model_format == "fbx") {
				card_model = this.getFBXModelSkinnedMesh(this.all_card[card_id_number].model);
			} else {
				card_model = this.all_card[card_id_number].model;
			}

			card_model.material.emissive.setHex(card_model.init_emissive_color);

			delete this.all_flash_card[card_id_number];
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 更新定位卡模型
	 *
	 * @param {Number} card_id 定位卡卡号
	 * @param {object} model_key 模型key
	 * @return {Boolean}  返回操作结果
	 */
	updateCardModel = (card_id:any, model_key:any, options:any) => {
		let card_id_number = parseInt(card_id);
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_model[model_key] == undefined) {
			console.error("该模型还未加载");
			return false;
		}

		if (this.all_card[card_id_number]) {
			/* 保存用来创建小地图会用到的模型材质 */
			let card_model_material = undefined;
			let card_object = this.all_card[card_id_number];
			let old_model = this.all_card[card_id_number].model;

			this.all_model_in_the_scene.remove(old_model);

			if (card_object.model_format == "fbx") {
				let skinned_mesh = this.getFBXModelSkinnedMesh(old_model);
				skinned_mesh.material.dispose();
				skinned_mesh.geometry.dispose();
			} else if (card_object.model_format == "json") {
				old_model.material.dispose();
				old_model.geometry.dispose();
			}

			/* 去掉fbx模型的动画 */
			if (this.mixers[card_id_number]) {
				this.mixers[card_id_number].uncacheAction();
			}

			/* 针对fbx模型的处理 */
			if (this.all_model[model_key].model_format == "fbx") {

				let fbx_model = this.FbxClone(this.all_model[model_key] as THREE.Group);

				/* 针对fbx模型的动画等处理 */
				(fbx_model as any).mixer = new THREE.AnimationMixer(fbx_model);
				(fbx_model as any).mixer.clock = new THREE.Clock();
				this.mixers[card_id_number] = (fbx_model as any).mixer;
				this.mixers[card_id_number].timeScale = 0.01;
				let action = (fbx_model as any).mixer.clipAction(fbx_model.animations[0]);
				action.play();

				let skinned_mesh = this.getFBXModelSkinnedMesh(fbx_model);

				card_model_material = skinned_mesh.material;
				(fbx_model as any).model_id = card_id_number;
				(fbx_model as any).model_type = 1;
				if (options && options.scale) {
					fbx_model.scale.x = options.scale;
					fbx_model.scale.y = options.scale;
					fbx_model.scale.z = options.scale;
				}
				skinned_mesh.init_emissive_color = skinned_mesh.material.emissive.getHex();

				this.all_model_in_the_scene.add(fbx_model);

				card_object.model = fbx_model;
				card_object.model_format = "fbx";
				card_object.model_height = (fbx_model as any).model_height;
			} else if (this.all_model[model_key].model_type == "json") {
				/** json模型的处理和其余json模型几乎一样，可以考虑封装函数统一处理 */

				let json_model = this.all_model[model_key].clone();

				card_model_material = (json_model as any).material;
				json_model.model_id = card_id_number;
				json_model.model_type = '1';
				if (options && options.scale) {
					json_model.scale.x = options.scale;
					json_model.scale.y = options.scale;
					json_model.scale.z = options.scale;
				}
				(json_model as any).init_emissive_color = (json_model as any).material.emissive.getHex();
				json_model.model_height = this.all_model[model_key].model_height;           /** clone无法克隆自定义的属性，除fbx模型外，其它模型的高度都存储在模型本身 */

				this.all_model_in_the_scene.add(json_model);

				card_object.model = json_model;
				card_object.model_format = "json";
				card_object.model_height = json_model.model_height;
			}

			/* 处理之前的文字label */
			if (card_object.label) {
				old_model.remove(card_object.label);
				card_object.model.add(card_object.label);
				card_object.label.position.set(0, card_object.model_height, 0);
			}

			card_object.model.position.set(old_model.position.x, old_model.position.y, old_model.position.z);
			card_object.model.rotation.y = old_model.rotation.y;

			if (this._select_card_id === card_id_number) {
				this.selectCard(card_id_number);
			}
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 选中定位卡
	 *
	 * @param {Number} card_id 定位卡卡号
	 * @return {Boolean}  返回操作结果
	 */
	selectCard = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_card[card_id_number]) {
			let card_model = undefined;
			if (this.all_card[card_id_number].model_format == "fbx") {
				card_model = this.getFBXModelSkinnedMesh(this.all_card[card_id_number].model);
			} else {
				card_model = this.all_card[card_id_number].model;
			}

			/** 取消选中其它的模型 */
			if (this._click_select_obj !== undefined) {
				this.unSelectModel(this._click_select_obj);
			}

			this.selectModel(card_model);
			this._click_select_obj = card_model;
			this._select_card_id = card_id_number;
		} else {
			console.error("该卡尚未添加到地图中");
			return false;
		}
	};

	/**
	 * 取消选中定位卡
	 *
	 * @return {Boolean}  返回操作结果
	 */
	unSelectCard = () => {
		/** 取消选中其它的模型 */
		if (this._click_select_obj) {
			if (this._click_select_obj.model_type == '1') {
				this.unSelectModel(this._click_select_obj);
				this._click_select_obj = undefined;
			} else if ((this._click_select_obj as any).isSkinnedMesh && (this._click_select_obj as any).parent.model_type == 1) {
				this.unSelectModel(this._click_select_obj);
				this._click_select_obj = undefined;
			}
		}
		this._select_card_id = undefined;
	};


	/**
	 * 添加区域
	 * @param {Object} zone_json 区域的json对象
	 * @return {Boolean}   返回是否成功
	 */
	addZone = (zone_json:any) => {
		let zone_data = zone_json;
		let zone_color = OPTIONS.ZONE_COLOR;//区域默认颜色
		if (zone_data.zone_color != undefined) {
			zone_color = zone_data.zone_color;
		}

		let key = zone_data.id;
		if (!this.all_zone_list[key]) {
			this.all_zone_list[key] = [];
			this.all_zone_material[key] = [];
			this.all_zone_edge_line[key] = [];
		} else {
			console.error("该区域已经添加");
			return false;
		}

		zone_data.z_start = parseFloat(zone_data.z_start);
		zone_data.z_end = parseFloat(zone_data.z_end);
		let data_list = zone_data.area_list;

		// 一次区域可以包含多个几何体
		for (let j = 0; j < data_list.length; j++) {

			// 如果区域物体已存在，需要先删除已经存在的区域物体
			if (this.all_zone_list[key][j]) {
				this.area_group.remove(this.all_zone_list[key][j]);
				this.all_zone_list[key][j].geometry.dispose();
				this.all_zone_list[key][j].material.dispose();

				for (let item in this.all_zone_edge_line[key][j]) {
					this.area_group.remove(item as any);
				}

				this.all_zone_list[key][j] = null;
			}

			// 保存区域中的单个几何体
			this.all_zone_edge_line[key][j] = [];

			// 区域的坐标点列表
			let data = data_list[j].area;

			let vertices = [];
			let indices = [];

			let geometry = new THREE.BufferGeometry();

			// 为几何体创建边线
			for (let i = 0; i < data.length; i++) {
				let next_index = (i + 1) % data.length;
				let current_data = data[i];
				let next_data = data[next_index];

				// 一个四边形，包含四个顶点
				vertices.push(current_data.x, zone_data.z_start, -current_data.y);
				vertices.push(next_data.x, zone_data.z_start, -next_data.y);
				vertices.push(next_data.x, zone_data.z_end, -next_data.y);
				vertices.push(current_data.x, zone_data.z_end, -current_data.y);

				let start_point = current_data;
				let end_point = current_data;
				let object_0 = this._createZoneEdgeLine(start_point, zone_data.z_start, end_point, zone_data.z_end);
				object_0.userData.key = key;
				this.area_group.add(object_0);
				this.all_zone_edge_line[key][j].push(object_0);

				start_point = current_data;
				end_point = next_data;
				let object_1 = this._createZoneEdgeLine(start_point, zone_data.z_start, end_point, zone_data.z_start);
				object_1.userData.key = key;
				this.area_group.add(object_1);
				this.all_zone_edge_line[key][j].push(object_1);

				start_point = next_data;
				end_point = next_data;
				let object_2 = this._createZoneEdgeLine(start_point, zone_data.z_start, end_point, zone_data.z_end);
				object_2.userData.key = key;
				this.area_group.add(object_2);
				this.all_zone_edge_line[key][j].push(object_2);

				start_point = current_data;
				end_point = next_data;
				let object_3 = this._createZoneEdgeLine(start_point, zone_data.z_end, end_point, zone_data.z_end);
				object_3.userData.key = key;
				this.area_group.add(object_3);
				this.all_zone_edge_line[key][j].push(object_3);
			}

			// 为顶部的那面添加顶点
			for (let i = 0; i < data.length; i++) {
				vertices.push(data[i].x, zone_data.z_end, -data[i].y);
			}

			// 为几何体四周创建面
			for (let i = 0; i < data.length; i++) {
				let start_index = i * 4;
				indices.push(start_index, start_index + 1, start_index + 2);
				indices.push(start_index, start_index + 2, start_index + 3)
			}

			// 为几何体顶部创建面
			for (let i = 0; i < data.length - 2; i++) {
				// 因为是双面，所以不用考虑点的顺序
				let first = data.length * 4;
				let second = first + i + 1;

				indices.push(first, second, second + 1);
			}

			vertices = new Float32Array(vertices) as any;

			geometry.setIndex(indices);
			geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

			let object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
				color: zone_color,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.2
			}));

			object.name = key;
			object.userData.key = key;
			this.area_group.add(object);

			this.all_zone_list[key][j] = object;

			// object.material.init_zone_color = zone_color;
			this.all_zone_material[key][j] = object.material;
		}

		return true;
	};

	/**
	 * 生成区域的边线
	 *
	 * @ignore
	 */
	 _createZoneEdgeLine = (start_point:{x:number,y:number}, start_point_z:number, end_point:{x:number,y:number}, end_point_z:number) => {

		let geometry = new THREE.BufferGeometry();
		let material = new THREE.LineBasicMaterial({
			// vertexColors: THREE.VertexColors
			vertexColors: true
		});
		let color1 = new THREE.Color(0x144bfd);
		let color2 = new THREE.Color(0x144bfd);

		// 线的材质可以由2点的颜色决定
		let vertices = new Float32Array([
			start_point.x, start_point_z, -start_point.y,
			end_point.x, end_point_z, -end_point.y
		]);

		let colors = new Float32Array([
			color1.r, color1.g, color1.b,
			color2.r, color2.g, color2.b

		])

		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
		return new THREE.Line(geometry, material);
	}

	/**
	 * 获得当前是否有该区域
	 * @param {Number} area_id 区域的ID
	 * @return {Boolean | Array}  是否已经添加该区域
	 */
	getZoneStatus = (area_id:number) => {
		if (area_id !== undefined) {
			let area_id_number = area_id;
			if (isNaN(area_id_number)) {
				console.error("错误的区域ID");
				return false;
			}

			return !!this.all_zone_list[area_id_number];
		} else {
			let result = [];
			for (let i in this.all_zone_list) {
				result.push(parseInt(i))
			}
			return result;
		}
	}


	/**
	 * 删除区域
	 * @param {Object} zone_id 区域的json对象
	 * @return {Boolean}   返回是否成功
	 */
	removeZone = (zone_id:number) => {
		let zone_id_number = zone_id;
		if (isNaN(zone_id_number)) {
			console.error("removeZone 参数类型错误");
			return false;
		}

		let key = zone_id_number;
		let zones = this.all_zone_list[key];
		if (zones != undefined) {
			for (let i = 0; i < zones.length; i++) {
				if (zones[i]) {
					this.area_group.remove(zones[i]);
					zones[i].geometry.dispose();
					zones[i].material.dispose();
					zones[i] = null;
				}

				for (let t = 0; t < this.all_zone_edge_line[key][i].length; t++) {
					this.area_group.remove(this.all_zone_edge_line[key][i][t]);
					this.all_zone_edge_line[key][i][t].geometry.dispose();
					this.all_zone_edge_line[key][i][t].material.dispose();
					this.all_zone_edge_line[key][i][t] = null;
				}
			}
			delete this.all_zone_list[key];
			delete this.all_zone_material[key];
			delete this.all_zone_edge_line[key];
		}

		return true;
	};


	/**
	 * 删除全部区域
	 */
	removeAllZone = () => {
		for (let i in this.all_zone_list) {
			this.removeZone(parseInt(i));
		}
	}

	/**
	 * 显示所有区域
	 * @return {Boolean}   返回是否成功
	 */
	showAllZone = () => {
		for (let key in this.all_zone_list) {
			for (let i = 0; i < this.all_zone_list[key].length; i++) {
				let zone = this.all_zone_list[key][i];
				if (zone) {
					zone.visible = true;
				}

				for (let t = 0; t < this.all_zone_edge_line[key][i].length; t++) {
					this.all_zone_edge_line[key][i][t].visible = true;
				}
			}
		}
		return true;
	};

	/**
	 * 隐藏所有区域
	 * @return {Boolean}   返回是否成功
	 */
	hideAllZone = () => {
		for (let key in this.all_zone_list) {
			for (let i = 0; i < this.all_zone_list[key].length; i++) {
				let zone = this.all_zone_list[key][i];
				if (zone) {
					zone.visible = false;
				}

				for (let t = 0; t < this.all_zone_edge_line[key][i].length; t++) {
					this.all_zone_edge_line[key][i][t].visible = false;
				}
			}
		}
		return true;
	};

	/**
	 * 显示指定区域
	 * @param {Object} zone_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	showZone = (zone_id:number) => {
		let zone_id_number = zone_id;
		if (isNaN(zone_id_number)) {
			console.error("showZone 参数类型错误");
			return false;
		}

		if (this.all_zone_list[zone_id_number]) {
			for (let i = 0; i < this.all_zone_list[zone_id_number].length; i++) {
				let zone = this.all_zone_list[zone_id_number][i];
				if (zone) {
					zone.visible = true;
				}

				for (let t = 0; t < this.all_zone_edge_line[zone_id_number][i].length; t++) {
					this.all_zone_edge_line[zone_id_number][i][t].visible = true;
				}
			}
		} else {
			console.error("该区域还未添加");
			return false
		}
		return true;
	};

	/**
	 * 隐藏指定区域
	 * @param {Object} zone_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	hideZone = (zone_id:number) => {
		let zone_id_number = zone_id;
		if (isNaN(zone_id_number)) {
			console.error("hideZone 参数类型错误");
			return false;
		}

		if (this.all_zone_list[zone_id_number]) {
			let zones = this.all_zone_list[zone_id_number];
			for (let i = 0; i < zones.length; i += 1) {
				if (zones[i]) {
					zones[i].visible = false;
				}
				for (let t = 0; t < this.all_zone_edge_line[zone_id_number][i].length; t++) {
					this.all_zone_edge_line[zone_id_number][i][t].visible = false;
				}
			}
		} else {
			console.error("该区域还未添加");
			return false
		}
		return true;
	};

	/**
	 * 开始区域闪烁
	 * @param {Object} zone_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	startZoneFlash = (zone_id:number) => {
		let zone_id_number = zone_id;
		if (isNaN(zone_id_number)) {
			console.error("hideZone 参数类型错误");
			return false;
		}

		if (!this.flash_zone_material) {
			this.flash_zone_material = new THREE.MeshBasicMaterial({
				color: this.options.flash_color_1,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.2
			});
		}

		if (this.all_zone_list[zone_id_number]) {
			for (let i in this.all_zone_list[zone_id_number]) {
				this.all_zone_list[zone_id_number][i].material = this.flash_zone_material;
			}
			this.all_flash_zone_list[zone_id_number] = true
		} else {
			console.error("该区域还未添加");
			return false
		}
		return true;

	};

	/**
	 * 停止区域闪烁
	 * @param {Object} zone_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	stopZoneFlash = (zone_id:number) => {
		let zone_id_number = zone_id;
		if (isNaN(zone_id_number)) {
			console.error("stopZoneFlash 参数类型错误");
			return false;
		}

		if (this.all_zone_list[zone_id_number]) {
			for (let i in this.all_zone_list[zone_id_number]) {
				this.all_zone_list[zone_id_number][i].material = this.all_zone_material[zone_id_number][i];
			}
			delete this.all_flash_zone_list[zone_id_number];
		} else {
			console.error("该区域还未添加");
			return false
		}
		return true;
	};

	/**
	 * 更新每张卡的平滑动画
	 * @param delta_time 上一帧到这一帧的时间戳 单位毫秒 
	 * @returns 
	 */
	_updateAllCardPosition = (delta_time:number) => {
		for (let i in this.all_card) {
			let card_id = parseInt(i);
			// 如果动画卡号列表没有当前卡号 可能卡号没有添加 直接返回
			if (!this.all_card_animation_position[card_id]) return;
			let position_data_len = this.all_card_animation_position[card_id].length;
			// 如果动画卡号列表为空 则说明卡号坐标没有更新 设置three.js动画的timeScale属性为0.01 FBX动画播放频率最慢
			if (position_data_len < 1) {
				if (this.mixers[card_id]) {
					this.mixers[card_id].timeScale = 0.01;
				}
				continue;
			}

			// 动画还未开始，需要先缓存足够时长的数据 并继续一下轮循环
			if ((this.all_card[card_id].is_start_animation == false) && (this.all_card_animation_position[card_id][position_data_len - 1].time - this.all_card_animation_position[card_id][0].time < (this.options.cache_time as number) * 1000)) continue;
			// 如果代码到这就说明需要开始移动标签模型了 需要把FBX的timeScale属性设置到最大 这是模型动画播放最快
			if (this.mixers[card_id]) {
				this.mixers[card_id].timeScale = 1;
			}
			// 这是一个经验算法 用于后面计算这一帧移动的坐标 由于后面坐标的计算方式存在缺陷 所以这里需要一个速度的系数来弥补计算坐标造成的缺陷 不然模型移动延迟会越来越高  
			let accelerate_speed = 1 + position_data_len * position_data_len / 100;
			// 原本两帧之间的时间差乘以一个大于1的速度系数 用新的两帧之间的时间差来弥补计算坐标的缺陷   
			delta_time = delta_time * accelerate_speed;
			/**
			 * this.all_card_animation_position[card_id][0].time 需要动画的第一帧的时间戳
			 * this.all_card[card_id].start_time 已经被渲染的当前帧的时间戳
			 * delta_time 两帧之间的毫秒时间
			 * elapsed 当前坐标到下一个坐标的移动百分比
			 */
			let elapsed = delta_time / (this.all_card_animation_position[card_id][0].time - this.all_card[card_id].start_time);

			if (elapsed == Infinity || elapsed == -Infinity || isNaN(elapsed)) {
				elapsed = 0;
			}

			if (this.all_card[card_id].is_need_update_rotation) {
				let model_rotate = this._getNextPointRotate(this.all_card[card_id].model.position, {
					x: this.all_card_animation_position[card_id][0].x,
					y: this.all_card_animation_position[card_id][0].y,
					z: this.all_card_animation_position[card_id][0].z
				});
				this.all_card[card_id].model.rotation.y = model_rotate;
				this.all_card[card_id].is_need_update_rotation = false;
			}
			// 根据elapsed是否大于1下一帧移动的坐标 如果大于1直接移动到下一次需要移动到的坐标 如果小于1则根据百分比计算
			if (elapsed > 0 && elapsed < 1) {
				let next_point_x = this.all_card[card_id].model.position.x + (this.all_card_animation_position[card_id][0].x - this.all_card[card_id].model.position.x) * elapsed;
				let next_point_y = this.all_card[card_id].model.position.y + (this.all_card_animation_position[card_id][0].y - this.all_card[card_id].model.position.y) * elapsed;
				let next_point_z = this.all_card[card_id].model.position.z + (this.all_card_animation_position[card_id][0].z - this.all_card[card_id].model.position.z) * elapsed;
				this.all_card[card_id].model.position.set(next_point_x, next_point_y, next_point_z);
				this.all_card[card_id].start_time += delta_time;

				/* 处理轨迹追踪，需要保持需要轨迹追踪的卡的历史点，并且维持一定长度 */
				if (this.all_track_card[card_id]) {
					this._addTrackCardPositiondata(card_id, next_point_x, next_point_y, next_point_z, true);
				}

			} else {
				this.all_card[card_id].model.position.set(this.all_card_animation_position[card_id][0].x, this.all_card_animation_position[card_id][0].y, this.all_card_animation_position[card_id][0].z);

				this.all_card[card_id].start_time = this.all_card_animation_position[card_id][0].time;

				/* 处理轨迹追踪，需要保持需要轨迹追踪的卡的历史点，并且维持一定长度 */
				if (this.all_track_card[card_id]) {
					this._addTrackCardPositiondata(card_id, this.all_card_animation_position[card_id][0].x, this.all_card_animation_position[card_id][0].y, this.all_card_animation_position[card_id][0].z, false);
				}

				this.all_card_animation_position[card_id].shift();

				this.all_card[card_id].is_need_update_rotation = true;
			}

			this.all_card[card_id].is_start_animation = true;

			/* 如果开启阴影需要移动阴影的图标 */
			if (this.options.open_shadow) {
				this.all_shadow_model[card_id].position.set(this.all_card[card_id].model.position.x, 0, this.all_card[card_id].model.position.z);
			}

			/* 如果开启小地图需要移动小地图的图标 */
			// if (this.options.open_little_map && this.all_overview_card[card_id]) {
			// 	this.all_overview_card[card_id].position.set(this.all_card[card_id].model.position.x, this.all_card[card_id].model.position.y, this.all_card[card_id].model.position.z)
			// }
		}
	};

	/**
	 * 添加轨迹追踪
	 * @param {Number} card_id 标签卡的卡号
	 * @param {String} color 可选，轨迹的颜色
	 * @return {Boolean}   返回是否成功
	 */
	addTrack = (card_id:number, color?:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}
		if (!this.all_track_card[card_id_number]) {
			this.all_track_card[card_id_number] = true;
			this.all_track_color[card_id_number] = color ? color : Math.random() * 0xffffff;
			this.all_track_card_is_show[card_id_number] = true;
			return true;
		} else {
			console.error("已经添加了该轨迹，不能重复添加");
			return false;
		}
	};

	/**
	 * 查询定位卡是否处于轨迹追踪状态
	 * @param {Number} card_id 标签卡的卡号
	 * @return {Boolean | Array}   返回是否成功
	 */
	getTrackStatus = (card_id:number) => {
		if (card_id !== undefined) {
			let card_id_number = card_id;
			if (isNaN(card_id_number)) {
				console.error("错误的卡号");
				return false;
			}

			return !!this.all_track_card[card_id_number];
		} else {
			let result = [];
			for (let i in this.all_track_card) {
				result.push(parseInt(i))
			}
			return result;
		}
	}

	/**
	 * 清除指定的轨迹
	 * @param {Number} card_id 标签卡的卡号
	 * @return {Boolean}   返回是否成功
	 */
	clearTrack = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_track_card[card_id_number] && this.all_track_card[card_id_number].isMesh) {
			this.track_line_group.remove(this.all_track_card[card_id_number]);
			this.all_track_card[card_id_number].geometry.dispose();
			this.all_track_card[card_id_number].material.dispose();
		}
		this.all_track_card_position[card_id_number] = undefined;
		this.all_track_card_animation[card_id_number] = undefined;
		return true;
	};

	/**
	 * 清除全部的轨迹
	 * @return {Boolean}   返回是否成功
	 */
	clearAllTrack = () => {
		this.removeGroupChildren(this.track_line_group);
		for (let i in this.all_track_card) {
			let card_id_number = parseInt(i);
			this.all_track_card_position[card_id_number] = undefined;
			this.all_track_card_animation[card_id_number] = undefined;
		}
		return true;
	};

	/**
	 * 删除一张卡的轨迹追踪状态
	 * @param {Number} card_id 标签卡的卡号
	 * @return {Boolean}   返回是否成功
	 */
	removeTrack = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (this.all_track_card[card_id_number] && this.all_track_card[card_id_number].isMesh) {
			this.scene.remove(this.all_track_card[card_id_number]);
			this.all_track_card[card_id_number].geometry.dispose();
			this.all_track_card[card_id_number].material.dispose();
		}

		delete this.all_track_card[card_id_number];
		delete this.all_track_card_position[card_id_number];
		delete this.all_track_card_animation[card_id_number];
		delete this.all_track_color[card_id_number];
		delete this.all_track_card_is_show[card_id_number];

		return true;
	};

	/**
	 * 删除全部卡的轨迹追踪状态
	 * @return {Boolean}   返回是否成功
	 */
	removeAllTrack = () => {
		this.removeGroupChildren(this.track_line_group);
		this.all_track_card = [];
		this.all_track_card_is_show = [];
		this.all_track_color = [];
		this.all_track_card_position = [];
		this.all_track_card_animation = [];

		return true;
	};

	/**
	 * 根据点，生成一条轨迹
	 *
	 * @ignore
	 */
	private _createHGLine = (posArr:{x:number,y:number,z:number}[], color:THREE.Color, track_height:number, is_curve?:boolean) => {
		let points = [];
		for (let i = 0; i < posArr.length; i++) {
			points.push(new THREE.Vector3(posArr[i].x, posArr[i].y + track_height, posArr[i].z));
		}
		// Position and THREE.Color Data

		let positions = [];
		let colors = [];
		color = new THREE.Color(color);
		if (is_curve) {
			let spline = new THREE.CatmullRomCurve3( points );
			let divisions = Math.round( 12 * points.length );
			let point = new THREE.Vector3();

			for ( let i = 0, l = divisions; i < l; i ++ ) {
				let t = i / l;
				spline.getPoint( t, point );
				positions.push( point.x, point.y, point.z );
				colors.push( color.r, color.g, color.b );
			}
		} else {
			for (let i of points.values()) {
				positions.push(i.x,i.y,i.z)
				colors.push( color.r, color.g, color.b );
			}
		}
		return [positions, colors];
	}

	/**
	 * 处理轨迹绘制
	 *
	 * @ignore
	 * @param {Number}  标签卡的卡号
	 * @param {Number}  定位坐标x
	 * @param {Number}  定位坐标y
	 * @param {Number}  定位坐标z
	 * @return {Boolean}   返回是否成功
	 */
	_updateCardTrack = () => {
		this.removeGroupChildren(this.track_line_group);
		let current_frame_track_lines_positions:any = [];
		let current_frame_track_lines_colors:any = [];

		for (let i in this.all_track_card) {
			let card_id = parseInt(i);
			if (this.all_track_card_is_show[card_id] && this.all_track_card_animation[card_id] && this.all_track_card_animation[card_id]!.length > 1) {
				let [positions, colors] = this._createHGLine(this.all_track_card_animation[card_id] as {x:number,y:number,z:number}[], this.all_track_color[card_id], this.options.track_height as number);
				current_frame_track_lines_positions.push(positions);
				current_frame_track_lines_colors.push(colors);
			}
		}

		if (current_frame_track_lines_positions.length == current_frame_track_lines_colors.length && current_frame_track_lines_positions.length > 0){
			let track_geometry =  new LineGeometry();
			track_geometry.setPositions(current_frame_track_lines_positions);
			track_geometry.setColors(current_frame_track_lines_colors);
			this.track_mesh = new Line2( track_geometry, this.track_material );
			this.track_mesh.scale.set( 1, 1, 1 );
			// this.track_mesh.computeLineDistances();
			this.track_line_group.add(this.track_mesh);
		}
	};


	/**
	 * 添加基站
	 * @param {Number} base_station_id 基站的ID
	 * @param {Number} base_station_x 基站的ID
	 * @param {Number} base_station_y 基站的ID
	 * @param {Number} base_station_z 基站的ID
	 * @param {String} model_key 基站的ID
	 * @return {Boolean}   返回是否成功
	 */
	addBaseStation = (base_station_id:number, base_station_x:number, base_station_y:number, base_station_z:number, model_key:string) => {
		let base_station_id_number = base_station_id;
		let base_station_x_number = base_station_x;
		let base_station_y_number = base_station_z;
		let base_station_z_number = -base_station_y;
		let internal_model_key = model_key ? model_key : "base_station";

		if (isNaN(base_station_id_number) || isNaN(base_station_x_number) || isNaN(base_station_y_number) || isNaN(base_station_z_number)) {
			console.error("错误的参数");
			return false;
		}

		if (this.all_base_station_model[base_station_id_number]) {
			console.error("该基站已经添加");
			return false;
		}

		if (this.all_model[internal_model_key]) {
			let base_station_model = this.all_model[internal_model_key].clone();
			base_station_model.model_height = this.all_model[internal_model_key].model_height;
			base_station_model.model_id = base_station_id;
			base_station_model.model_type = '2';
			base_station_model.position.set(base_station_x_number, base_station_y_number, base_station_z_number);
			this.scene.add(base_station_model);
			this.all_model_in_the_scene.add(base_station_model);
			this.all_base_station_model[base_station_id_number] = base_station_model;
		} else {
			console.error("基站模型还未加载");
			return false;
		}
	};

	/**
	 * 删除指定基站
	 * @param {Object} base_station_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	removeBaseStation = (base_station_id:number) => {
		let base_station_id_number = base_station_id;

		if (isNaN(base_station_id_number)) {
			console.error("错误的参数");
			return false;
		}

		if (this.all_base_station_model[base_station_id_number]) {
			this.all_model_in_the_scene.remove(this.all_base_station_model[base_station_id_number]);
			(this.all_base_station_model[base_station_id_number] as any).material.dispose();
			(this.all_base_station_model[base_station_id_number] as any).geometry.dispose();

			delete this.all_base_station_model[base_station_id_number]
		} else {
			console.error("该基站还未添加");
			return false;
		}
	};

	/**
	 * 删除全部基站
	 * @return {Boolean}   返回是否成功
	 */
	removeAllBaseStation = () => {
		for (let i in this.all_base_station_model) {
			this.all_model_in_the_scene.remove(this.all_base_station_model[i]);
			(this.all_base_station_model[i] as any).material.dispose();
			(this.all_base_station_model[i] as any).geometry.dispose();
		}
		this.all_base_station_model = [];
		return true;
	};

	/**
	 * 隐藏指定基站
	 * @param {Number} base_station_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	hideBaseStation = (base_station_id:number) => {
		let base_station_id_number = base_station_id;

		if (isNaN(base_station_id_number)) {
			console.error("错误的参数");
			return false;
		}

		if (this.all_base_station_model[base_station_id_number]) {
			this.all_base_station_model[base_station_id_number].visible = false;
		} else {
			console.error("该基站还未添加");
			return false;
		}
	};

	/**
	 * 隐藏全部基站
	 * @param {Object}  区域id
	 * @return {Boolean}   返回是否成功
	 */
	hideAllBaseStation = () => {
		for (let i in this.all_base_station_model) {
			this.all_base_station_model[i].visible = false;
		}
		return true;
	};

	/**
	 * 显示指定基站
	 * @param {Object} base_station_id 区域id
	 * @return {Boolean}   返回是否成功
	 */
	showBaseStation = (base_station_id:number) => {
		let base_station_id_number = base_station_id;

		if (isNaN(base_station_id_number)) {
			console.error("错误的参数");
			return false;
		}

		if (this.all_base_station_model[base_station_id_number]) {
			this.all_base_station_model[base_station_id_number].visible = true;
		} else {
			console.error("该基站还未添加");
			return false;
		}
	};

	/**
	 * 显示全部基站
	 * @return {Boolean}   返回是否成功
	 */
	showAllBaseStation = () => {
		for (let i in this.all_base_station_model) {
			this.all_base_station_model[i].visible = true;
		}
	};

	/**
	 * 巡视场景
	 * @param {Number} speed 镜头移动的速度
	 * @param {Number} circle_number 巡视镜头旋转的圈数
	 * @param {Number} circle_speed 巡视镜头旋转速度
	 * @return {Boolean}   返回是否成功
	 */
	patrolScene = (speed:number, circle_number:number, circle_speed:number) => {
		let camera_model_patrol_dist = this.options.camera_model_patrol_dist;

		/** 相机看向定位卡，且禁止使用 */
		this.controls.target = this.init_target_position;
		this.controls.enabled = false;
		this.controls.autoRotate = false;
		this.controls.update();


		this.camera_rotate_number = this.options.patrol_circle_number as number;
		this.camera_rotate_speed = this.options.camera_rotate_speed as number;

		if (circle_number && !isNaN(circle_number)) {
			this.camera_rotate_number = circle_number
		}

		if (circle_speed && !isNaN(circle_speed)) {
			this.camera_rotate_speed = circle_speed
		}

		/** 根据设定的相机距离定位卡距离，计算目的地址坐标 */
		let dest_x = this.init_camera_position.x + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);
		let dest_y = this.init_camera_position.y + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);
		let dest_z = this.init_camera_position.z + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number)/ 3);

		/** 计算总共的移动距离，用以计算动画时间 */
		let dist = (this.camera.position.x - dest_x) * (this.camera.position.x - dest_x) +
			(this.camera.position.y - dest_y) * (this.camera.position.y - dest_y) +
			(this.camera.position.z - dest_z) * (this.camera.position.z - dest_z);
		dist = Math.sqrt(dist);

		/* 判断移动速度 */
		let move_speed = this.options.camera_speed;
		if (!isNaN(speed)) {
			move_speed = speed;
		}

		/* 设定移动动画，动画完成后需要删除动画对象，避免额外的性能开销 */
		this.camera_tween = new TWEEN.Tween(this.camera.position);
		this.camera_tween.to({x: dest_x, y: dest_y, z: dest_z}, 1000 * dist / (move_speed as number));
		this.camera_tween.onComplete((() => {
			TWEEN.remove(this.camera_tween as TWEEN.Tween<THREE.Vector3>);
			this.camera_tween = undefined;
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = this.camera_rotate_speed;
			// this.camera_rotate_count = 0;
			this.controls.update();
			this.is_camera_rotate = true;
		}).bind(this));
		this.camera_tween.start();
	};

	/**
	 * 巡视定位卡
	 * @param {Number} card_id 标签卡的卡号
	 * @param {Number} speed 镜头移动的速度
	 * @param {Number} circle_number 巡视镜头旋转的圈数
	 * @param {Number} circle_speed 巡视镜头旋转速度
	 * @return {Boolean}   返回是否成功
	 */
	patrolCard = (card_id:number, speed:number, circle_number:number, circle_speed:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (!this.all_card[card_id_number]) {
			console.error("该卡尚未添加到地图中");
			return false;
		}

		this.now_patrol_card = card_id_number;
		this.showCard(card_id_number);

		let card_object = this.all_card[card_id_number].model;
		let camera_model_patrol_dist = this.options.camera_model_patrol_dist;

		/** 相机看向定位卡，且禁止使用 */
		this.controls.target = card_object.position.clone();
		this.controls.enabled = false;
		this.controls.autoRotate = false;
		this.controls.update();


		this.camera_rotate_number = this.options.patrol_circle_number as number;
		this.camera_rotate_speed = this.options.camera_rotate_speed as number;

		if (circle_number && !isNaN(circle_number)) {
			this.camera_rotate_number = circle_number
		}

		if (circle_speed && !isNaN(circle_speed)) {
			this.camera_rotate_speed = circle_speed
		}

		/** 根据设定的相机距离定位卡距离，计算目的地址坐标 */
		let dest_x = card_object.position.x + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);
		let dest_y = card_object.position.y + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);
		let dest_z = card_object.position.z + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);

		/** 计算总共的移动距离，用以计算动画时间 */
		let dist = (this.camera.position.x - dest_x) * (this.camera.position.x - dest_x) +
			(this.camera.position.y - dest_y) * (this.camera.position.y - dest_y) +
			(this.camera.position.z - dest_z) * (this.camera.position.z - dest_z);
		dist = Math.sqrt(dist);

		/* 判断移动速度 */
		let move_speed = this.options.camera_speed;
		if (!isNaN(speed)) {
			move_speed = speed;
		}

		/* 设定移动动画，动画完成后需要删除动画对象，避免额外的性能开销 */
		this.camera_tween = new TWEEN.Tween(this.camera.position);
		this.camera_tween.to({x: dest_x, y: dest_y, z: dest_z}, 1000 * dist / (move_speed as number));
		this.camera_tween.onComplete((() => {
			TWEEN.remove(this.camera_tween as TWEEN.Tween<THREE.Vector3>);
			this.camera_tween = undefined;
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = this.camera_rotate_speed;
			// this.camera_rotate_count = 0;
			this.controls.update();
			this.is_camera_rotate = true;
		}).bind(this));
		this.camera_tween.start();
	};

	/**
	 * 巡视指定坐标的
	 * @param {Number} x 巡视位置坐标X
	 * @param {Number} y 巡视位置坐标Y
	 * @param {Number} z 巡视位置坐标Z
	 * @param {Number} speed 镜头移动的速度
	 * @param {Number} circle_number 巡视镜头旋转的圈数
	 * @param {Number} circle_speed 巡视镜头旋转速度
	 * @return {Boolean}   返回是否成功
	 */
	patrolCoordinate = (x:number, y:number, z:number, speed:number, circle_number:number, circle_speed:number) => {
		if (isNaN(x) || isNaN(y) || isNaN(z)) {
			console.error("参数类型错误");
			return false;
		}

		let camera_model_patrol_dist = this.options.camera_model_patrol_dist;

		/** 相机看向定位卡，且禁止使用 */
		this.controls.target = new THREE.Vector3(x, z, -y);
		this.controls.enabled = false;
		this.controls.autoRotate = false;
		this.controls.update();

		this.camera_rotate_number = this.options.patrol_circle_number as number;
		this.camera_rotate_speed = this.options.camera_rotate_speed as number;

		if (circle_number && !isNaN(circle_number)) {
			this.camera_rotate_number = circle_number
		}

		if (circle_speed && !isNaN(circle_speed)) {
			this.camera_rotate_speed = circle_speed
		}

		/** 根据设定的相机距离定位卡距离，计算目的地址坐标 */
		let dest_x = x + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number)/ 3);
		let dest_y = -z + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);
		let dest_z = y + Math.sqrt(camera_model_patrol_dist as number * (camera_model_patrol_dist as number) / 3);

		/** 计算总共的移动距离，用以计算动画时间 */
		let dist = (this.camera.position.x - dest_x) * (this.camera.position.x - dest_x) +
			(this.camera.position.y - dest_y) * (this.camera.position.y - dest_y) +
			(this.camera.position.z - dest_z) * (this.camera.position.z - dest_z);
		dist = Math.sqrt(dist);

		/* 判断移动速度 */
		let move_speed = this.options.camera_speed;
		if (!isNaN(speed)) {
			move_speed = speed;
		}

		/* 设定移动动画，动画完成后需要删除动画对象，避免额外的性能开销 */
		this.camera_tween = new TWEEN.Tween(this.camera.position);
		this.camera_tween.to({x: dest_x, y: dest_y, z: dest_z}, 1000 * dist / (move_speed as number));
		this.camera_tween.onComplete((() => {
			TWEEN.remove(this.camera_tween as TWEEN.Tween<THREE.Vector3>);
			this.camera_tween = undefined;
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = this.camera_rotate_speed;
			// this.camera_rotate_count = 0;
			this.controls.update();
			this.is_camera_rotate = true;
		}).bind(this));
		this.camera_tween.start();
	};

	/**
	 * 开始第三人称跟随定位卡
	 * @param {Number} card_id 标签卡的卡号
	 * @return {Boolean}   返回是否成功
	 */
	startThirdPersonFollow = (card_id:number) => {
		let card_id_number = card_id;
		if (isNaN(card_id_number)) {
			console.error("错误的卡号");
			return false;
		}

		if (!this.all_card[card_id_number]) {
			console.error("该卡尚未添加到地图中");
			return false;
		}

		let card_object = this.all_card[card_id_number].model;

		this.third_person_init_rotate = card_object.rotation.y;
		this.third_person_camera_rotate = {y: this.third_person_init_rotate};

		let camera_position = this._getThirdPersonCameraPosition(card_object);
		this.camera.position.copy(camera_position);

		this.controls.target = card_object.position.clone();
		this.controls.target.y += this.options.third_person_target_height as number;

		this.third_person_card = card_id_number;
	}

	/**
	 * 结束第三人称跟随定位卡
	 * @return {Boolean}   返回是否成功
	 */
	stopThirdPersonFollow = () => {
		this.third_person_card = undefined;
		return true;
	}

	/**
	 * 更更新第三人称跟随时相机的坐标
	 * @return {Boolean}   返回是否成功
	 */
	_updateThirdPersonCamera = () => {
		let card_object = this.all_card[this.third_person_card as number].model;

		let camera_position = this._getThirdPersonCameraPosition(card_object);

		this.camera.position.copy(camera_position);

		this.controls.target = card_object.position.clone();
		this.controls.target.y += this.options.third_person_target_height as number;
	}


	_getThirdPersonCameraPosition = (target_model:THREE.Object3D) => {
		let rotation = target_model.rotation.y
		let position = target_model.position.clone();

		if (this.third_person_init_rotate !== rotation) {
			this.third_person_init_rotate = rotation;

			if (this.third_person_rotate_tween) {
				this.third_person_rotate_tween.stop();
			}

			this.third_person_rotate_tween = new TWEEN.Tween(this.third_person_camera_rotate);
			let tween_time_length = Math.abs(this.third_person_camera_rotate.y - this.third_person_init_rotate) / Math.PI * 1000;
			this.third_person_rotate_tween.to({y: this.third_person_init_rotate}, tween_time_length);
			this.third_person_rotate_tween.start();
		}

		let x = position.x - (this.options.third_person_dist as number) * Math.sin(this.third_person_camera_rotate.y);
		let y = position.y + (this.options.third_person_camera_height as number);
		let z = position.z - (this.options.third_person_dist as number) * Math.cos(this.third_person_camera_rotate.y);

		return new Vector3(x, y, z);
	}

	/**
	 * 场景开启聚类
	 * @return {Boolean}   返回是否成功
	 */
	enableCluster = () => {
		this.options.cluster_enable = true;
	};

	/**
	 * 场景关闭聚类
	 * @return {Boolean}   返回是否成功
	 */
	disableCluster = () => {
		this.options.cluster_enable = false;
	};

	/**
	 * 更新聚类
	 *
	 * @ignore
	 */
	_updateCardCluster = () => {
		let cluster_center_dict = {};
		let card_type_list = {};
		let card_status = {};
		let dist;

		/*
		* 找到每一张卡对应的直线距离在聚类标准以内的所有卡
		* 时间复杂度为n*n
		* */
		for (let i in this.all_card) {
			let first_card_position = this.all_card[i].model.position;
			let camera_position = this.camera.position;
			let tmp_array = [];
			tmp_array.push(parseInt(i));
			// let min_x, max_x, min_y, max_y, min_z, max_z;
			// min_x = max_x = first_card_position.x;
			// min_y = max_y = first_card_position.y;
			// min_z = max_z = first_card_position.z;
			dist = (first_card_position.x - camera_position.x) * (first_card_position.x - camera_position.x);
			dist = dist + (first_card_position.y - camera_position.y) * (first_card_position.y - camera_position.y);
			dist = dist + (first_card_position.z - camera_position.z) * (first_card_position.z - camera_position.z);
			dist = Math.sqrt(dist);

			for (let m in this.all_card) {
				if (i === m) {
					continue;
				}
				let second_card_position = this.all_card[m].model.position;

				let dist1 = (first_card_position.x - second_card_position.x) * (first_card_position.x - second_card_position.x);
				dist1 = dist1 + (first_card_position.y - second_card_position.y) * (first_card_position.y - second_card_position.y);
				dist1 = dist1 + (first_card_position.z - second_card_position.z) * (first_card_position.z - second_card_position.z);
				dist1 = Math.sqrt(dist1);

				if (dist1 < 0.5 + dist / (this.options.scale_dist as number)) {
					tmp_array.push(parseInt(m));
				}
			}
			card_type_list[i] = tmp_array;
		}

		/*
		* 需要找出所有挨着的卡，比如1，2，3挨着，同时3，4，5挨着，需要将1，2，3，4，5聚类到一起
		* 时间复杂度为n*n*n
		* */
		for (let key in card_type_list) {
			if (card_status[key] !== undefined) {
				continue;
			}

			let tmp_array = [];

			// 先找到一张卡所有挨着的卡，并存放在tmp_array中，并用card_status标记该卡是否已经被计算
			for (let i = 0; i < card_type_list[key].length; i++) {
				if (card_status[card_type_list[key][i]] === undefined) {
					tmp_array.push(card_type_list[key][i]);
					card_status[card_type_list[key][i]] = 1;
				}
			}

			/*
            再寻找所有tmp_array挨着的卡
            时间复杂度为n*n
            */
			let index = 0;
			while (tmp_array.length > index) {
				let tmp_key:any = tmp_array[index];
				for (let i = 0; i < card_type_list[tmp_key].length; i++) {
					if (card_status[card_type_list[tmp_key][i]] === undefined) {
						tmp_array.push(card_type_list[tmp_key][i]);
					}
					card_status[card_type_list[tmp_key][i]] = 1;
				}
				index++;
			}

			let min_x, max_x, min_y, max_y, min_z, max_z;
			min_x = max_x = this.all_card[key].model.position.x;
			min_y = max_y = this.all_card[key].model.position.y;
			min_z = max_z = this.all_card[key].model.position.z;

			for (let i = 0; i < tmp_array.length; i++) {

				let key1 = tmp_array[i];


				if (min_x > this.all_card[key1].model.position.x) {
					min_x = this.all_card[key1].model.position.x;
				}

				if (max_x < this.all_card[key1].model.position.x) {
					max_x = this.all_card[key1].model.position.x;
				}

				if (min_y > this.all_card[key1].model.position.y) {
					min_y = this.all_card[key1].model.position.y;
				}

				if (max_y < this.all_card[key1].model.position.y) {
					max_y = this.all_card[key1].model.position.y;
				}

				if (min_z > this.all_card[key1].model.position.z) {
					min_z = this.all_card[key1].model.position.z;
				}

				if (max_z < this.all_card[key1].model.position.z) {
					max_z = this.all_card[key1].model.position.z;
				}

			}

			let cluster_center = new THREE.Vector3((min_x + max_x) / 2, (min_y + max_y) / 2 + this.all_card[key].model_height, (min_z + max_z) / 2);
			let event:any = {};
			event.cluster_center_point = cluster_center;
			event.card_list = tmp_array;
			event.camera_dist = cluster_center.distanceTo(this.camera.position);
			cluster_center_dict[key] = event;
		}

		this.cluster_center_dict = cluster_center_dict;
	};

	/**
	 * 更新聚类的标签
	 *
	 * @ignore
	 */
	_updateCardClusterLabel = () => {
		for (let key in this.cluster_center_dict) {
			let screenCoord = this.positionToScreenXY(this.cluster_center_dict[key].cluster_center_point);
			this.cluster_center_dict[key].cluster_center = screenCoord;
		}

		this.dispatchEvent(EVENTS.UPDATECLUSTERCARDLABEL, this.cluster_center_dict);
	};
}

export default HGMap;

