// import {AbstractController} from './controller'
// import {All, Delete, Get, Head, Options, Patch, Post, Put} from './decorator'

// export class TestController extends AbstractController {
//   @All('/no-args-all')
//   public noArgsAll(): string {
//     return 'noArgsAll'
//   }

//   @Delete('/delete/:id')
//   public delete(): string {
//     const id = 10
//     return `delete ${id}`
//   }

//   @Get('/no-args-get')
//   public noArgsGet(): string {
//     return 'noArgsGet'
//   }

//   // public withArgsGet(@Req()): string {}

//   @Head('/head')
//   public head(): string {
//     return 'head'
//   }

//   @Options('/options')
//   public options(): string {
//     return 'options'
//   }

//   @Patch('/no-args-patch')
//   public noArgsPatch(): string {
//     return 'noArgsPatch'
//   }

//   @Post('/no-args-post')
//   public noArgsPost(): string {
//     return 'noArgsPost'
//   }

//   @Put('/no-args-put')
//   public noArgsPut(): string {
//     return 'noArgsPut'
//   }
// }
