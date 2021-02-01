import { Project, SourceFile, VariableDeclarationKind} from 'ts-morph';
import { compile, Options, Program } from 'glslx';

export class Compiler {

    private readonly options: Options = {
        disableRewriting: false,
        format: "json",
        keepSymbols: false,
        prettyPrint: false,
        renaming: "all",
    }

    compileTsFiles(glslxFileGlobs: string | string[], outputDir: string) {
        let project = new Project;
        project.addSourceFilesAtPaths(glslxFileGlobs);
        for (let src of project.getSourceFiles()) {
            this.compileTsFile(project, src, outputDir);
        }
        project.saveSync();
    }

    private compileTsFile(project: Project, file: SourceFile, outputDir: string) {
        let program = this.parseProgram(file);
        let uniform = this.parseVariables(program, 'uniform');
        let attribute = this.parseVariables(program, 'attribute');
        let filename = file.getBaseName().replace('.glslx', '.ts');
        let tsFile = project.createSourceFile(`${outputDir}/${filename}`, '', { overwrite: true });

        tsFile.addInterface({
            name: "Uniforms",
            isExported: true,
            indexSignatures: [{isReadonly: true, keyName: "name", keyType: "string", returnType: "WebGLUniformLocation"}],
            properties: uniform.variables.map(uniform => {
                return {
                    name: uniform.alias, 
                    type: "WebGLUniformLocation",
                    documentationComment: `The location of uniform ${uniform.type} ${uniform.alias}.`
                }
            })
        });

        tsFile.addInterface({
            name: "Attributes",
            isExported: true,
            indexSignatures: [{isReadonly: true, keyName: "name", keyType: "string", returnType: "number"}],
            properties: attribute.variables.map(attrib => {
                return {
                    name: attrib.alias, 
                    type: "number",
                    documentationComment: `The location of attribute ${attrib.type} ${attrib.alias}.`
                }
            })
        })

        tsFile.addTypeAlias({
            isExported: true,
            name: "Variables",
            type: "Uniforms|Attributes"
        })

        let constExports = tsFile.addVariableStatement({
            isExported: true,
            declarationKind: VariableDeclarationKind.Const,
            declarations: program.shaders.map(shader => { return {
                name: shader.name,
                initializer: JSON.stringify(shader.contents),
            }})
        })

        constExports.addDeclaration({
            name: "attributeRenaming",
            initializer: JSON.stringify(attribute.renaming),
        });

        constExports.addDeclaration({
            name: "uniformRenaming",
            initializer: JSON.stringify(uniform.renaming)
        });
    }

    private parseProgram(file: SourceFile): Program {
        let {log, output } = compile(file.getFullText(), this.options);
        if(log) throw log.replace("<stdin>", file.getFilePath()); 
        return JSON.parse(output);
    }

    private parseVariables(program: Program, type: 'uniform'|'attribute') {
        let variables = <Variable[]> [];
        let renaming = <StringMap> {};
        let regex = new RegExp(`${type} (.+?) (.+?);`, 'g');
        let match = <RegExpExecArray> null;
        for (let shader of program.shaders) {
            while(match = regex.exec(shader.contents)) {
                let type = match[1];                    // Vec2, Sampler2D, etc..
                let names = match[2].split(",");        // Declaration may contain multiple variables separated by commas
                for (let name of names) {
                    for(let property in program.renaming){
                        if(program.renaming[property] === name){
                            let variable = { name: name, alias: property, type: type }
                            if(!variables.some(uniform => uniform.name === variable.name)){
                                variables.push(variable);
                                renaming[property] = name;
                            }
                        }
                    } 
                }
            }        
        }
        return { variables: variables, renaming: renaming };
    }
}

interface Variable {
    name: string;
    alias: string;
    type: string;
}

interface StringMap {
    [key: string]: string;
}

