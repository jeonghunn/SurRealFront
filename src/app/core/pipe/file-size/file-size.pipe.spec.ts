import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  const pipe = new FileSizePipe();

  it('transforms 1337', () => {
    expect(pipe.transform(1337)).equal('1.34 KB');
  });

  it('transforms 1024', () => {
    expect(pipe.transform(1024)).equal('1.02 KB');
  });
});