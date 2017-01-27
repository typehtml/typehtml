import { VNode, VNodeFlags, VNodeProps as Props, Ref, ThChildren, Key } from '../types';
export { VNode, VNodeFlags, Props, Ref, ThChildren };
import {
	isArray,
	isInvalid,
	isNullOrUndef,
	isStatefulComponent,
	isStringOrNumber,
	isUndefined,
	isString,
	isNull
} from './shared';

import cloneVNode from './cloneVNode';

export interface Styles {
	[key: string]: number | string;
}

export interface IProps {
	[index: string]: any;
}
export interface VType {
	flags: VNodeFlags;
}

function _normalizeVNodes(nodes: any[], result: VNode<any>[], i: number): void {
	for (; i < nodes.length; i++) {
		let n = nodes[i];

		if (!isInvalid(n)) {
			if (Array.isArray(n)) {
				_normalizeVNodes(n, result, 0);
			} else {
				if (isStringOrNumber(n)) {
					n = createTextVNode(n);
				} else if (isVNode(n) && n.dom) {
					n = cloneVNode(n);
				}
				result.push((applyKeyIfMissing(i, n as VNode<any>)));
			}
		}
	}
}

function applyKeyIfMissing(index: number, vNode: VNode<any>): VNode<any> {
	if (isNull(vNode.key)) {
		vNode.key = `.${ index }`;
	}
	return vNode;
}

export function normalizeVNodes(nodes: any[]): VNode<any>[] {
	let newNodes;

	// we assign $ which basically means we've flagged this array for future note
	// if it comes back again, we need to clone it, as people are using it
	// in an immutable way
	// tslint:disable
	if (nodes['$']) {
		nodes = nodes.slice();
	} else {
		nodes['$'] = true;
	}
	// tslint:enable
	for (let i = 0; i < nodes.length; i++) {
		const n = nodes[i];

		if (isInvalid(n) || Array.isArray(n)) {
			const result = (newNodes || nodes).slice(0, i) as VNode<any>[];

			_normalizeVNodes(nodes, result, i);
			return result;
		} else if (isStringOrNumber(n)) {
			if (!newNodes) {
				newNodes = nodes.slice(0, i) as VNode<any>[];
			}
			newNodes.push(applyKeyIfMissing(i, createTextVNode(n)));
		} else if ((isVNode(n) && n.dom) || (isNull(n.key) && !(n.flags & VNodeFlags.HasNonKeyedChildren))) {
			if (!newNodes) {
				newNodes = nodes.slice(0, i) as VNode<any>[];
			}
			newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
		} else if (newNodes) {
			newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
		}
	}
	return newNodes || nodes as VNode<any>[];
}

function normalizeChildren(children: ThChildren | null) {
	if (isArray(children)) {
		return normalizeVNodes(children);
	} else if (isVNode(children as VNode<any>) && (children as any as VNode<any>).dom) {
		return cloneVNode(children as VNode<any>);
	}
	return children;
}

function normalizeProps(vNode: VNode<any>, props: Props, children: ThChildren) {
	if (!(vNode.flags & VNodeFlags.Component) && isNullOrUndef(children) && !isNullOrUndef(props.children)) {
		vNode.children = props.children;
	}
	if (props.ref) {
		vNode.ref = props.ref;
	}
	if (props.events) {
		vNode.events = props.events;
	}
	if (!isNullOrUndef(props.key)) {
		vNode.key = props.key;
	}
}

export function copyPropsTo(copyFrom: Props, copyTo: Props) {
	for (let prop in copyFrom) {
		if (isUndefined(copyTo[prop])) {
			copyTo[prop] = copyFrom[prop];
		}
	}
}

function normalizeElement(type: string, vNode: VNode<any>) {
	if (type === 'svg') {
		vNode.flags = VNodeFlags.SvgElement;
	} else if (type === 'input') {
		vNode.flags = VNodeFlags.InputElement;
	} else if (type === 'select') {
		vNode.flags = VNodeFlags.SelectElement;
	} else if (type === 'textarea') {
		vNode.flags = VNodeFlags.TextareaElement;
	} else if (type === 'media') {
		vNode.flags = VNodeFlags.MediaElement;
	} else {
		vNode.flags = VNodeFlags.HtmlElement;
	}
}

export function normalize(vNode: VNode<any>): void {
	const props = vNode.props;
	const type = vNode.type;
	let children = vNode.children;

	// convert a wrongly created type back to element
	if (isString(type) && (vNode.flags & VNodeFlags.Component)) {
		normalizeElement(type as string, vNode);
		if (props.children) {
			vNode.children = props.children;
			children = props.children;
		}
	}
	if (props) {
		normalizeProps(vNode, props, children);
	}
	if (!isInvalid(children)) {
		vNode.children = normalizeChildren(children);
	}
	if (props && !isInvalid(props.children)) {
		props.children = normalizeChildren(props.children);
	}
}

export function createVNode(
	flags: VNodeFlags,
	type?,
	props?: Props,
	children?: ThChildren,
	events?,
	key?: Key,
	ref?: Ref<any>,
	noNormalise?: boolean
): VNode<Props> {
	if (flags & VNodeFlags.ComponentUnknown) {
		flags = isStatefulComponent(type) ? VNodeFlags.ComponentClass : VNodeFlags.ComponentFunction;
	}
	const vNode: VNode<Props> = {
		children: isUndefined(children) ? null : children,
		dom: null,
		events: events || null,
		flags: flags || 0,
		key: key === undefined ? null : key,
		props: props || null,
		ref: ref || null,
		type
	};
	if (!noNormalise) {
		normalize(vNode);
	}
	return vNode;
}

export function createVoidVNode(): VNode<any> {
	return createVNode(VNodeFlags.Void);
}

export function createTextVNode(text: string | number): VNode<any> {
	return createVNode(VNodeFlags.Text, null, null, text);
}

export function isVNode(o: VNode<any>): boolean {
	return !!o.flags;
}
