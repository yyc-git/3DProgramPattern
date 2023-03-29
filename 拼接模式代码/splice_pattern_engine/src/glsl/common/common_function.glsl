@funcDefine
mat2 transpose(mat2 m) {
  return mat2(  m[0][0], m[1][0],   // new col 0
                m[0][1], m[1][1]    // new col 1
             );
  }
@end
