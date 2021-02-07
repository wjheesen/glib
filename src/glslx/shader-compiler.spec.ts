import { expect } from "chai";
import { ShaderCompiler } from './shader-compiler';

let compiler = new ShaderCompiler;
compiler.compileTsFiles('**/*.glslx', 'src/program/');