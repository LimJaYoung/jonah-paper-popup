import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const root=process.cwd();
const git=(args,cwd=root)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const remote=git(['remote','get-url','origin']);
const author=git(['log','-1','--format=%an']);
const email=git(['log','-1','--format=%ae']);
const sha=git(['rev-parse','--short','HEAD']);
const temp=await mkdtemp(path.join(tmpdir(),'jonah-pages-'));
try {
 const exists=git(['ls-remote','--heads',remote,'gh-pages']);
 if(exists) git(['clone','--single-branch','--branch','gh-pages',remote,temp]);
 else {git(['init','-b','gh-pages'],temp);git(['remote','add','origin',remote],temp);}
 for(const entry of await readdir(temp)) if(entry!=='.git')await rm(path.join(temp,entry),{recursive:true,force:true});
 await cp(path.join(root,'dist'),temp,{recursive:true});
 git(['add','--all'],temp);
 if(git(['status','--porcelain'],temp))git(['-c',`user.name=${author}`,'-c',`user.email=${email}`,'commit','-m',`Deploy popup book from ${sha}`],temp);
 git(['push','origin','gh-pages'],temp);
 console.log('Pushed site to gh-pages: https://limjayoung.github.io/jonah-paper-popup/');
} finally {await rm(temp,{recursive:true,force:true});}
