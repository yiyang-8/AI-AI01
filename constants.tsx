
import { DesignStyle, DesignMode } from './types';

export const DESIGN_STYLES: Record<DesignMode, DesignStyle[]> = {
  interior: [
    {
      id: 'scandinavian',
      name: '北欧风',
      description: '线条简洁、极简主义，结合浅色木材的功能之美。',
      previewUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
      prompt: 'Scandinavian style interior, light wood floors, neutral tones, minimalist furniture, functional layout.'
    },
    {
      id: 'mid-century',
      name: '世纪中期现代',
      description: '标志性的 50 和 60 年代风情，拥有有机形状和几何图案。',
      previewUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400',
      prompt: 'Mid-century modern interior, warm wood paneling, tapered legs, organic shapes.'
    },
    {
      id: 'bohemian',
      name: '波西米亚',
      description: '质感、图案和绿植的自由混合。',
      previewUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400',
      prompt: 'Bohemian style room, layered rugs, indoor plants, rattan furniture, eclectic vibe.'
    },
    {
      id: 'japandi',
      name: '日式禅意',
      description: '日式美学与北欧功能主义的完美结合。',
      previewUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=400',
      prompt: 'Japandi interior, zen atmosphere, low profile furniture, bamboo accents, earthy palette.'
    }
  ],
  exterior: [
    {
      id: 'modern-min',
      name: '现代极简别墅',
      description: '大面积玻璃与白色混凝土的纯粹几何感。',
      previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      prompt: 'Ultra-modern minimalist villa, large glass facades, white concrete, clean geometric lines, architectural lighting.'
    },
    {
      id: 'french-manor',
      name: '法式庄园',
      description: '古典对称的石材外墙与宏伟入口。',
      previewUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
      prompt: 'Classical French manor architecture, stone facade, symmetrical design, slate roof, grand entrance.'
    },
    {
      id: 'organic-wright',
      name: '赖特有机建筑',
      description: '建筑与自然融为一体，水平线条与自然石材。',
      previewUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400',
      prompt: 'Organic architecture in the style of Frank Lloyd Wright, natural stone and wood, horizontal planes, cantilevered roofs.'
    },
    {
      id: 'futurism',
      name: '未来主义',
      description: '流动性的有机造型与金属外壳，极具科幻感。',
      previewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
      prompt: 'Futuristic building design, parametric organic shapes, metallic and glass skin, integrated neon lighting.'
    }
  ],
  landscape: [
    {
      id: 'zen-stone',
      name: '枯山水',
      description: '禅意的沙石组合，枫树与竹篱。',
      previewUrl: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=400',
      prompt: 'Japanese Zen stone garden, raked sand, moss stones, maple trees, bamboo fencing.'
    },
    {
      id: 'english-garden',
      name: '英式花园',
      description: '自然生长的小径与繁茂的玫瑰花丛。',
      previewUrl: 'https://images.unsplash.com/photo-1558905730-27f912852920?auto=format&fit=crop&q=80&w=400',
      prompt: 'English cottage garden, winding stone paths, lush flower borders, rustic wooden gate.'
    },
    {
      id: 'tropical-resort',
      name: '热带度假风',
      description: '无边泳池，棕榈树与木质甲板。',
      previewUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
      prompt: 'Modern tropical landscape, infinity pool, palm trees, wooden pool deck, outdoor lounge area.'
    },
    {
      id: 'modern-courtyard',
      name: '现代庭院',
      description: '利落的铺装，火盆与几何绿植区。',
      previewUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=400',
      prompt: 'Sleek modern courtyard, fire pit, geometric planters, concrete slabs, architectural night lighting.'
    }
  ]
};
