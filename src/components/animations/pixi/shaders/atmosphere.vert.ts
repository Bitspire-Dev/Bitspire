// Fullscreen triangle vertex shader — covers the screen with a single
// triangle so the fragment shader can paint the entire background.
// PixiJS v8 Mesh provides `aPosition` (0..1) and we map to clip space.

export const atmosphereVertex = /* glsl */ `
in vec2 aPosition;
out vec2 vUv;

uniform vec4 uScreen;

void main() {
  vUv = aPosition;
  vec2 pos = aPosition * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;
