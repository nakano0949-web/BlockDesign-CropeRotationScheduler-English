// --- Database ---
const familyCandidates = ["Solanaceae", "Brassicaceae", "Fabaceae", "Poaceae", "Amaranthaceae", "Apiaceae", "Asteraceae", "Cucurbitaceae", "Rosaceae", "Lamiaceae", "Amaryllidaceae", "Zingiberaceae", "Araceae", "Convolvulaceae", "Malvaceae", "Asparagaceae"];

const familyToVeg = {
  "Solanaceae": ["Tomato", "Eggplant", "Pepper", "Potato"],
  "Brassicaceae": ["Cabbage", "Napa Cabbage", "Broccoli", "Radish", "Komatsuna"],
  "Fabaceae": ["Edamame", "Green Beans", "Snap Peas", "Broad Beans"],
  "Poaceae": ["Corn", "Wheat"],
  "Amaranthaceae": ["Spinach", "Beets"],
  "Apiaceae": ["Carrot", "Parsley", "Celery"],
  "Asteraceae": ["Lettuce", "Shungiku", "Burdock"],
  "Cucurbitaceae": ["Cucumber", "Watermelon", "Pumpkin", "Zucchini"],
  "Rosaceae": ["Strawberry"],
  "Lamiaceae": ["Perilla", "Basil"],
  "Amaryllidaceae": ["Chives", "Leek", "Onion", "Garlic"],
  "Zingiberaceae": ["Ginger"],
  "Araceae": ["Taro", "Konjac"],
  "Convolvulaceae": ["Sweet Potato"],
  "Malvaceae": ["Okra"],
  "Asparagaceae": ["Asparagus"]
};

const familyInfo = {
  "Solanaceae": { desc: "High risk of soil-borne diseases. Wait 3-4 years.", soil: "Slightly acidic to neutral", pests: "Aphids", rotation: "3-4 years", good: ["Amaryllidaceae"], bad: ["Solanaceae"] },
  "Brassicaceae": { desc: "Beware of clubroot. Wait 2-3 years.", soil: "pH 6.5 or higher", pests: "Diamondback moth", rotation: "2-3 years", good: ["Amaryllidaceae"], bad: ["Brassicaceae"] },
  "Fabaceae": { desc: "Enriches soil through nitrogen fixation.", soil: "Prefer dry", pests: "Stink bugs", rotation: "1-2 years", good: ["Solanaceae"], bad: ["Fabaceae"] },
  "Poaceae": { desc: "Deep roots help improve soil structure.", soil: "Neutral", pests: "Corn borer", rotation: "1-2 years", good: ["Fabaceae"], bad: ["Poaceae"] },
  "Cucurbitaceae": { desc: "Vining plants that prefer fertile soil.", soil: "Neutral to slightly alkaline", pests: "Aulacophora", rotation: "2-3 years", good: ["Fabaceae"], bad: ["Cucurbitaceae"] }
  // (Other families can be added following this pattern)
};

const familyStats = {
  "Fabaceae": { n_score: -10 },
  "Solanaceae": { n_score: 15 },
  "Brassicaceae": { n_score: 12 },
  "Poaceae": { n_score: 5 },
  "Cucurbitaceae": { n_score: 10 },
  "Amaryllidaceae": { n_score: 2 },
  "Asteraceae": { n_score: 3 },
  "Apiaceae": { n_score: 4 },
  "Amaranthaceae": { n_score: 6 },
  "Lamiaceae": { n_score: 2 },
  "Convolvulaceae": { n_score: 8 },
  "Malvaceae": { n_score: 10 }
};

let currentBlocks = [];
let currentType = "";
let currentP = 0;

// --- Algorithm ---
function rebuildPlanes(p, type) {
  const q = p * p + p + 1;
  const array = Array.from({ length: q }, (_, i) => i);
  const array1 = [];
  for (let i = 1; i <= p; i++) {
    array1[i - 1] = array.filter(v => p * (i + 1) >= v && p * i < v);
  }
  const proj = [];
  const aff = [];
  for (let num = 1; num < q; num += p) {
    const datan = [0];
    const dataa = [];
    for (let h = 0; h < p; h++) {
      datan[h + 1] = array[num + h];
      dataa[h] = array[num + h] - p - 1;
    }
    proj.push(datan);
    aff.push(dataa);
  }
  for (let i = 0; i < p; i++) {
    for (let num = 0; num < p; num++) {
      const n = idx => array1[idx][(num + i * idx) % array1[idx].length];
      const a = idx => array1[idx][(num + i * idx) % array1[idx].length] - p - 1;
      const ndata = [array[i + 1]];
      const adata = [];
      for (let h = 0; h < p; h++) {
        ndata[h + 1] = n(h);
        adata[h] = a(h);
      }
      proj.push(ndata);
      aff.push(adata);
    }
  }
  if (type === "affine") {
    aff.shift();
    return { blocks: aff, count: p * p };
  } else {
    return { blocks: proj, count: q };
  }
}

// --- UI Control ---
function generate() {
  currentP = Number(document.getElementById("pSelect").value);
  currentType = document.getElementById("planeType").value;
  const result = rebuildPlanes(currentP, currentType);
  currentBlocks = result.blocks;
  const tbody = document.getElementById("vegTable").tBodies[0];
  tbody.innerHTML = "";
  for (let i = 0; i < result.count; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td><select class="fam-sel"><option value="">Select▼</option>${familyCandidates.map(f=>`<option value="${f}">${f}</option>`).join("")}</select></td>
      <td><select class="veg-sel"><option value="">(Choose Family First)</option></select></td>
    `;
    const famSel = tr.querySelector(".fam-sel");
    const vegSel = tr.querySelector(".veg-sel");
    famSel.addEventListener("change", () => {
      const fam = famSel.value;
      vegSel.innerHTML = (familyToVeg[fam] || []).map(v=>`<option value="${v}">${v}</option>`).join("") || `<option value="">N/A</option>`;
      showFamilyInfo(fam);
    });
    tbody.appendChild(tr);
  }
  document.getElementById("setupArea").style.display = "block";
  document.getElementById("rotation").innerHTML = "";
}

function showFamilyInfo(fam) {
  const box = document.getElementById("familyInfoBox");
  if (!familyInfo[fam]) { box.style.display = "none"; return; }
  const info = familyInfo[fam];
  box.innerHTML = `<b>【${fam} Info】</b> Characteristics: ${info.desc} | Soil: ${info.soil} | Compatible with: ${info.good.join(",")}`;
  box.style.display = "block";
}

function makeSchedule() {
  const vegElements = Array.from(document.querySelectorAll(".veg-sel"));
  const famElements = Array.from(document.querySelectorAll(".fam-sel"));
  const vegData = vegElements.map((sel, idx) => ({
    name: sel.value || `Plot ${idx}`,
    family: famElements[idx].value
  }));
  const ul = document.getElementById("rotation");
  ul.innerHTML = "";
  let soilBalances = new Array(currentP * currentP + (currentType === "projective" ? currentP + 1 : 0)).fill(0);

  if (currentType === "affine") {
    for (let c = 0; c < currentP + 1; c++) {
      const start = c * currentP;
      const classBlocks = currentBlocks.slice(start, start + currentP);
      if (classBlocks.length === 0) continue;
      classBlocks.forEach(block => {
        block.forEach(pIdx => {
          const fam = vegData[pIdx].family;
          if (familyStats[fam]) soilBalances[pIdx] += familyStats[fam].n_score;
        });
      });
      const li = document.createElement("li");
      const text = classBlocks.map((b, i) => `  Ridge ${i+1}: ` + b.map(id => vegData[id].name).join(" → ")).join("\n");
      li.textContent = `【Year ${c+1}】\n${text}`;
      ul.appendChild(li);
    }
  } else {
    currentBlocks.forEach((block, y) => {
      block.forEach(pIdx => {
        const fam = vegData[pIdx].family;
        if (familyStats[fam]) soilBalances[pIdx] += familyStats[fam].n_score;
      });
      const li = document.createElement("li");
      li.textContent = `【Block ${y+1} (Year/Season)】\n` + block.map(id => vegData[id].name).join(" → ");
      ul.appendChild(li);
    });
  }
  displaySoilAnalysis(soilBalances);
}

function displaySoilAnalysis(balances) {
  const ul = document.getElementById("rotation");
  const analysisLi = document.createElement("li");
  const totalBalance = balances.reduce((a, b) => a + b, 0);
  const avgBalance = (totalBalance / balances.length).toFixed(1);
  const isSustainable = avgBalance <= 0;

  if (isSustainable) {
    analysisLi.style.background = "#e8f5e9";
    analysisLi.style.border = "2px solid #4caf50";
  } else {
    analysisLi.style.background = "#fff3e0";
    analysisLi.style.border = "2px solid #ff9800";
  }
  
  const statusMsg = isSustainable 
    ? `<span style='color:green;'>✅ Soil Accumulation Mode (Sustainable)</span>` 
    : `<span style='color:red;'>⚠️ Soil Depletion Mode (Risk of nitrogen deficiency)</span>`;

  analysisLi.innerHTML = `
    <strong>【Soil Fertility Analysis】</strong><br>
    Status: ${statusMsg}<br>
    Average balance after 1 cycle: <b>${avgBalance}</b> 
    <small>(Lower/negative values indicate richer soil)</small><br>
    <p style="margin-top:5px; font-size:0.9em;">
      ${avgBalance < -10 ? "💡 Soil energy is excessive. You can add more 'heavy feeders' like eggplants or tomatoes." : 
        avgBalance < 0 ? "💡 Ideal self-sustaining cycle. Sustainable without external fertilizers." : 
        "💡 Too much nitrogen 'withdrawal'. Consider adding more legume blocks (Fabaceae)."}
    </p>
    <small>*Based on cumulative load coefficients across all plots.</small>
  `;
  ul.prepend(analysisLi);
}
