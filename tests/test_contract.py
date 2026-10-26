import unittest,tempfile,zipfile,json
from pathlib import Path
from studio_core import package_errors,load,status
class ContractTests(unittest.TestCase):
    def test_flat_package(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'test.zip'
            with zipfile.ZipFile(p,'w') as z:z.writestr('01.png',b'frame');z.writestr('prompt.txt','The lamp turns gently.')
            self.assertEqual(package_errors(p),[])
    def test_nested_or_excess_frames_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'bad.zip'
            with zipfile.ZipFile(p,'w') as z:
                for n in range(11):z.writestr(f'assets/{n}.png',b'x')
                z.writestr('prompt.txt','x');z.writestr('metadata.json','{}')
            self.assertEqual(len(package_errors(p)),3)
    def test_fresh_checkout_empty(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d);(p/'templates').mkdir();(p/'templates/project-content.json').write_text('{"scenes":[]}')
            self.assertEqual(status(p)['scenes'],0)
if __name__=='__main__':unittest.main()
