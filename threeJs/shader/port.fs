uniform sampler2D depthtexture;
uniform sampler2D normaltexture;
varying vec2 vUv;
float planeDistance(const in vec3 positionA, const in vec3 normalA, 
                    const in vec3 positionB, const in vec3 normalB) {
  vec3 positionDelta = positionB-positionA;
  float planeDistanceDelta = max(abs(dot(positionDelta, normalA)), abs(dot(positionDelta, normalB)));
  return planeDistanceDelta;
}
void main() {
    vec2 planeDist = vec2(
        planeDistance(leftpos, leftnor, rightpos, rightnor),
        planeDistance(uppos, upnor, downpos, downnor));
      float planeEdge = 2.5 * length(planeDist);
      planeEdge = 1.0 - 0.5 * smoothstep(0.0, depthCenter, planeEdge);
      float normEdge = max(length(leftnor - rightnor), length(upnor - downnor));
      normEdge = 1.0 - 0.5 * smoothstep(0.0, 0.5, normEdge); 
      float edge= planeEdge * normEdge;
      gl_FragColor = vec3(edge, 1.0);
}
