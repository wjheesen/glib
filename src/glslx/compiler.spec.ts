import { expect } from "chai";
import { Compiler } from './compiler';

let compiler = new Compiler;
compiler.compileTsFiles('**/*.glslx', 'src/shader/');