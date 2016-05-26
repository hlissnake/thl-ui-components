import React from 'react';
import forEach from 'lodash/forEach';

let cachedComponents;
let cachedVersionKeys;
let latestNonPreVersion;

function resolveVersion(targetVersion) {
	let versionParts = targetVersion.split(/[\.\-\+]/);
	if (versionParts[0][0] === '~') {
		return cachedVersionKeys[parseInt(versionParts[0].replace(/[^0-9]/ig, ''))].versions[parseInt(versionParts[1])].latestVersion;
	} else if (versionParts[0][0] === '^') {
		return cachedVersionKeys[latestNonPreVersion.major].latestVersion;
	} else {
		return {
			major: parseInt(versionParts[0]),
			minor: parseInt(versionParts[1]),
			patch: parseInt(versionParts[2]),
			pre: versionParts[3] || 'undefined'
		};
	}
}

function getLatest(targetVersion) {
	let versionParts = targetVersion.split(/[\.\-\+]/);
	if (versionParts[0][0] === '~') {
		return cachedVersionKeys[parseInt(versionParts[0].replace(/[^0-9]/ig, ''))].versions[parseInt(versionParts[1])].latestComponent;
	} else if (versionParts[0][0] === '^') {
		return cachedVersionKeys[latestNonPreVersion.major].latestComponent;
	} else {
		try {
			return cachedComponents[targetVersion];
		} catch(e) {}
	}
}

function greaterVersionObject(vo1, vo2) {
	if (
		!vo1 && vo2 ||
		vo2.major > vo1.major || (
		vo2.major === vo1.major && (
		vo2.minor > vo1.minor || (
		vo2.minor === vo1.minor && (
		vo2.patch > vo1.patch || (
		vo2.patch === vo1.patch &&
		vo2.pre === 'undefined'
	)))))) {
		return vo2;
	} else {
		return vo1;
	}
}

function insertVersion(tree, component, versionObject, keyPath = ['major', 'minor', 'patch', 'pre']) {
	if (keyPath.length === 1) {
		tree[versionObject.pre] = component;
	} else {
		if (tree[versionObject[keyPath[0]]]) {
			tree[versionObject[keyPath[0]]].latestVersion = greaterVersionObject(tree[versionObject[keyPath[0]]].latestVersion, versionObject);
			if (tree[versionObject[keyPath[0]]].latestVersion === versionObject) {
				tree[versionObject[keyPath[0]]].latestComponent = component;
			}
		} else {
			tree[versionObject[keyPath[0]]] = {
				versions: {},
				latestComponent: component,
				latestVersion: versionObject
			};
		}
		insertVersion(tree[versionObject[keyPath[0]]].versions, component, versionObject, keyPath.slice(1));
	}
}

function VersionedComponent(props) {
	if (props.components !== cachedComponents) {
		cachedComponents = props.components;
		cachedVersionKeys = {};
		forEach(Object.keys(props.components), versionNumber => {
			let versionParts = versionNumber.split(/[\.\-\+]/);
			let versionObject = {
				major: parseInt(versionParts[0]),
				minor: parseInt(versionParts[1]),
				patch: parseInt(versionParts[2]),
				pre: versionParts[3] || 'undefined'
			};
			latestNonPreVersion = greaterVersionObject(latestNonPreVersion, versionObject);
			insertVersion(cachedVersionKeys, cachedComponents[versionNumber], versionObject);
		});
	}
	let matchedVersion = getLatest(props.version);
	if (!matchedVersion) {
		throw new Error(`Failed to find component for version ${props.version}`);
	}
	
	let _version = resolveVersion(props.version);
	return React.createElement(matchedVersion, {...props, resolvedVersion: `${_version.major}.${_version.minor}.${_version.patch}${_version.pre === 'undefined' ? '': ('+' + _version.pre)}`});
}

VersionedComponent.propTypes = {
	version: React.PropTypes.string,
	components: React.PropTypes.object
};

export default VersionedComponent;
