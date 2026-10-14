# Motorcycle image reuse and exact-model review (release gate)

Generated from `scripts/data/motorcycle-image-closeout-20261008.json` (dated 2026-10-08). This is an **evidence checklist**, not proof of copyright ownership or permission.

**Decision:** Do not merge PR #459 or redistribute its 20 photo files until each image is either (a) supported by permission/license allowing MotoIndex hosting, redistribution, editing/cropping and commercial website use, or (b) replaced with a licensed or owned exact-model image. Credit, provenance, a public URL, and a manufacturer name do not establish permission.

For every image: verify that the photography depicts the exact model / generation / market; identify the actual copyright holder; retain a written rights document or source license/terms; record approval evidence and its date in issue #463. If permission is unavailable, remove the imported binary and its product-media mapping before proposing any merger.

| Model ID | Source / provenance (verify actual owner) | Reference page | Exact-model visual QA | Commercial reuse/license evidence | Decision |
|---|---|---|---|---|---|
| `yamaha-sr400` | Yamaha / webオートバイ | [Reference](https://www.autoby.jp/_ct/17449188/album/16799356/image/16933666) | Pending | Pending | Hold |
| `honda-pcx150` | Honda / Saba Cycle | [Reference](https://sabacyclet.com/%D9%87%D9%88%D9%86%D8%AF%D8%A7-pcx-150/) | Pending | Pending | Hold |
| `benelli-motobi-200-evo` | Benelli | [Reference](https://www.benelli.com/ph-en/products/motobi-200-evo) | Pending | Pending | Hold |
| `honda-genio` | Honda / TMCBlog | [Reference](https://tmcblog.com/2023/07/25/ahm-rilis-warna-dan-striping-baru-honda-genio-2023/) | Pending | Pending | Hold |
| `honda-rs125` | Honda / Zigwheels Philippines | [Reference](https://www.zigwheels.ph/new-motorcycles/honda/rs125-fi/images) | Pending | Pending | Hold |
| `honda-rs150r` | Honda / Paultan | [Reference](https://paultan.org/2022/03/03/2022-honda-rs150r-updated-for-malaysia-rm8299/2022-honda-rs150r-radiate-grey-metallic-8/) | Pending | Pending | Hold |
| `honda-scoopy` | Honda / Tawee Sub Yanyont | [Reference](https://www.taveesubyanyont.com/product-page/all-new-honda-scoopy-2024-prestige) | Pending | Pending | Hold |
| `kawasaki-klx-140` | Kawasaki / autoevolution | [Reference](https://www.autoevolution.com/moto/kawasaki-klx140-2014.html) | Pending | Pending | Hold |
| `kawasaki-ninja-zx-10r` | Kawasaki / Thai Motor Show | [Reference](https://bikes.thaimotorshow.com/en/cdzenb-kawasaki-ninja-zx-r) | Pending | Pending | Hold |
| `kawasaki-ninja-zx-6r` | Kawasaki | [Reference](https://www.kawasaki.at/de_at/Motorcycles/Supersport_Sport/Ninja_zx-6r_2026.html/ZX636JTFAN/ZX636JTFANPE/MetallicMatteGrapheneSteelGrayMetallicSparkBlackLimeGreen) | Pending | Pending | Hold |
| `kawasaki-z900-se` | Kawasaki / Andar de Moto | [Reference](https://www.andardemoto.pt/motos-novas/p-3910/kawasaki-z900-se/) | Pending | Pending | Hold |
| `suzuki-smash-carb` | Suzuki / press image | [Reference](https://mc.suzuki.com.ph/motorcycles/underbone/smash-carb/) | Pending | Pending | Hold |
| `tvs-ntorq-125` | TVS / ManualsLib | [Reference](https://www.manualslib.com/manual/2113778/Tvs-Ntorq-125.html) | Pending | Pending | Hold |
| `vespa-s-125` | Vespa / MotoRival | [Reference](https://www.motorival.com/2020-vespa-s-125-get-yellow/) | Pending | Pending | Hold |
| `yamaha-aerox-v1` | Thai Yamaha Motor | [Reference](https://www.yamaha-motor.co.th/commuter/yamaha-aerox-155/specification) | Pending | Pending | Hold |
| `yamaha-nmax-v1` | Yamaha / BM Garage | [Reference](https://www.bmgarage.sg/services/bike-servicing/19W8UrLyn0A47tYrTFxP) | Pending | Pending | Hold |
| `yamaha-sniper-150` | Yamaha / Zigwheels Philippines | [Reference](https://www.zigwheels.ph/new-motorcycles/yamaha/sniper-150/colors) | Pending | Pending | Hold |
| `yamaha-sz` | Yamaha / Suerte Motoplaza | [Reference](https://suertemotoplaza.com/products/yamaha-sz/) | Pending | Pending | Hold |
| `yamaha-tricity` | Yamaha / Motouutiset | [Reference](https://www.motouutiset.fi/fi/moottoripyorat/uutiset/495/Yamaha-Tricity--skootteri-urbaani-kallistuva-kolmipy%C3%B6r%C3%A4-Yamaha-Tricity.htm) | Pending | Pending | Hold |
| `yamaha-yzf-r15-v3` | Yamaha / Motown India | [Reference](https://www.motownindia.com/Bureau/auto-pit-bikes/597/Yamaha-introduces-Dual-Channel-ABS-for-YZF-R15-V30-at-Rs-139-lakh-onward-Motown-India-Bureau) | Pending | Pending | Hold |

## Acceptance record (per image)

- [ ] The identifiable photo matches the specific motorcycle model/year/generation, including original paint or bodywork as represented.
- [ ] Rights holder or authorized licensing party independently identified and corroborated.
- [ ] License/permission covers storing the file on MotoIndex infrastructure, publishing, cropping/editing and commercial use; territorial/time restrictions recorded.
- [ ] Approved source URL, evidence record, approver and approval date documented without embedding credentials or confidential license terms.
- [ ] Any unsupported photo replaced or removed from `public/media/motorcycles` **and** generated media mappings, or the associated model falls back to the existing non-licensed-placeholder path.
- [ ] Test strict media validation, visual QA and product coverage **on the final approved image set** after replacements.

Tracking issue: https://github.com/erwinmehehe/motoindex-ph/issues/463

No rights approvals are asserted by this checklist. No unverified image should be merged on the strength of test coverage alone.
