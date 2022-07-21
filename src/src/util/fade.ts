import Color from "color";

export default function fade(color: string, alpha: number) {
	return new Color(color).alpha(alpha).hexa();
}

export function multiplicativeFade(color: string, mulA: number) {
	const c = new Color(color);
	return c.alpha(c.alpha() * mulA).hexa();
}