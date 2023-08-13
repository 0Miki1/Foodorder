<?php 
    class user {
        private $email;
        private $loggedIn;

        public function __construct($email, $loggedIn) {
            $this->email = $email;
            $this->loggedIn = $loggedIn;
        }

        public function getLoggedIn() {
            return $this->loggedIn;
        }

        public function getEmail() {
            return $this->email;
        }
    }

    class order implements JsonSerializable{
        private $restaurant;
        private $megrendelo;
        private $items;
        
        public function __construct($restaurant, $megrendeloEmail) {
            $this->restaurant = $restaurant;
            $this->items = array();
            $this->megrendelo = $this->SelectMegrendeloNev($megrendeloEmail);
        }

        
        public function getRestaurant() {
            return $this->restaurant;
        }

        public function setItems($items) {
            $this->items = $items;
        }

        public function getItems() {
            return $this->items;
        }

        public function getMegrendelo() {
            return $this->megrendelo;
        }

        public function priceSum() {
            $sum = 0;

            for ($i=0; $i < count($this->items); $i++) { 
                $sum += intval($this->items[$i]->price) * intval($this->items[$i]->value);
            }

            return $sum;
        }

        private function SelectMegrendeloNev($email) {
            $conn = new mysqli("localhost", "root", "", "foodorder");

            if (!$conn->connect_error) {
                $conn->set_charset("utf8");

                $sql = "SELECT CONCAT(vezeteknev, ' ', keresztnev) AS nev FROM megrendelo WHERE email LIKE ?;";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $email);
                $stmt->execute();

                $result = $stmt->get_result();

                $row = $result->fetch_assoc();

                return $row["nev"];
            } else {
                return "";
            }
        }

        public function jsonSerialize() {
            return [
                "nev" => $this->getMegrendelo(),
                "etterem" => $this->getRestaurant(),
                "items" => $this->getItems(),
                "priceSum" => $this->priceSum()
            ];
        }
    }

    session_start();

    if(isset($_POST["f"])) {
        switch($_POST["f"]) {
            case "checkLogin":
                checkLogin();
                break;
            case "getRestaurants":
                if(isset($_POST["d"])) {
                    SelectRestaurants($_POST["d"]);
                } else {
                    SelectRestaurants(null);
                }
                break;
            case "getRestaurantTypes":
                SelectRestaurantTypes();
                break;
            case "setRestaurantData":
                setRestData($_POST["d"]);
                break;
            case "search":
                if ($_POST["search"] == "") {
                    SelectRestaurants(null);
                } else {
                    searchForRestaurants($_POST["search"]);
                }
                break;
            case "login":
                login($_POST["email"], $_POST["pw"]);
                break;
            case "logout":
                logout();
                break;
            case "registration": 
                checkEmailIfExists($_POST["email"]);
                break;
            case "insertAddress":
                insertNewAddress($_SESSION["user"]->getEmail());
                break;
            case "getProfileData":
                getProfileData($_SESSION["user"]->getEmail());
                break;
            case "pwMod":
                pwMod($_SESSION["user"]->getEmail(), $_POST["pw"]);
                break;
            case "getRestaurantItems":
                getRestaurantItems($_SESSION["order"]->getRestaurant());
                break;
            case "itemsToOrder": 
                itemsToOrder();
                break;
            case "checkActiveOrder":
                checkActiveOrder();
                break;
            case "getRest":
                getRest();
                break;
            case "getOrderData":
                getOrderdata();
                break;
            case "getAddresses":
                getAddresses($_SESSION["user"]->getEmail());
                break;
            case "placeOrder":
                placeOrder($_SESSION["user"]->getEmail(), $_POST["d"], $_SESSION["order"]->getRestaurant());
                break;
            case "getAddressState":
                getAddressState($_SESSION["user"]->getEmail());
                break;
            case "vaneAktivRendelese":
                if (isset($_SESSION["user"])) {
                    vaneAktivRendelese($_SESSION["user"]->getEmail());
                } else {
                    echo 0;
                }
                break;
            case "getOrders":
                selectOrders($_SESSION["user"]->getEmail());
                break;
            case "testDbconnection":
                testDbconnection();
                break;
            case "selectDataTest":
                selectDataTest();
                break;
        }
    }

    function checkLogin() {
        if (isset($_SESSION["user"])){
            $loginstate = $_SESSION["user"]->getLoggedIn();
            echo json_encode($loginstate);
        } else {
            echo json_encode(false);
        }
    }

    function SelectRestaurants($filter) {
        $conn = new mysqli("localhost", "root", "", "foodorder");
        $rows = array();

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            if ($filter == null) {
                $sql1 = "SELECT nev, tipus FROM etterem;";

                $reader = $conn->query($sql1);

                while ($row1 = $reader->fetch_assoc()) {
                    $rows[] = $row1;
                }

                $conn->close();
            } else {
                $sql2 = "SELECT nev, tipus FROM etterem WHERE tipus LIKE ?;";

                $stmt = $conn->prepare($sql2);
                $stmt->bind_param("s", $filter);
                $stmt->execute();

                $result = $stmt->get_result();

                while($row2 = $result->fetch_assoc()) {
                    $rows[] = $row2;
                }

                $conn->close();
            }

            echo json_encode($rows);
        } else {
            echo 0;
        }
    }

    function SelectRestaurantTypes() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT DISTINCT tipus FROM etterem;";

            $result = $conn->query($sql);
            $rows = array();

            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            $conn->close();

            echo json_encode($rows);
        } else {
            echo 0;
        }
    }

    function setRestData($restName) {
        $_SESSION["order"] = new order($restName, $_SESSION["user"]->getEmail());

        echo 1;
    }

    function searchForRestaurants($statement) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT nev, tipus FROM etterem WHERE nev LIKE ?;";

            $searchStmt = '%'.$statement.'%';
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $searchStmt);
            $stmt->execute();

            $result = $stmt->get_result();
            $rows = array();

            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            $conn->close();

            echo json_encode($rows);
        } else {    
            echo 0;
        }
    }

    function login($email, $pw) {
        $regexEmail = '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/';
        $regexPw = '/^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\:;"<>,.?\/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_\-+={}[\]|\:;"<>,.?\/]{8,32}$/';

        if (preg_match($regexEmail, $email) && preg_match($regexPw, $pw)) {
            $conn = new mysqli("localhost", "root", "", "foodorder");
            $hashPw = hash("sha256", $pw);
    
            if (!$conn->connect_error)
            {
                $conn->set_charset("utf8");
    
                $sql = "SELECT email, jelszo FROM megrendelo WHERE email LIKE ? AND jelszo LIKE ?;";
    
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $email, $hashPw);
                $stmt->execute();
                $reader = $stmt->get_result();
    
                if ($reader->num_rows != 0)
                {
                    $_SESSION["user"] = new user($email, true);
                    $conn->close();
                    echo 1;
                } else
                {
                    $conn->close();
                    echo 0;
                }
            } else
            {
                echo 0;
            }
        } else {
            echo 0;
        }
    }

    function logout() {
        unset($_SESSION["user"]);

        echo 1;
    }

    function checkEmailIfExists($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT email FROM megrendelo WHERE email LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $result = $stmt->get_result();

            if ($result->num_rows != 0) {
                $conn->close();
                echo "emailExists";
            } else {
                $conn->close();
                registerNewUser($email);
            }
        } else {
            echo 0;
        }
    }

    function registerNewUser($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "INSERT INTO megrendelo(email, jelszo, vezeteknev, keresztnev, telefonszam) VALUES(?, ?, ?, ?, ?);";

            $pw = $_POST["pw"];
            $pwSHA256 = hash("sha256", $pw);
            $vNev = $_POST["vnev"];
            $kNev = $_POST["knev"];
            $tel = $_POST["tel"];
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssss", $email, $pwSHA256, $vNev, $kNev, $tel);
            $stmt->execute();

            $conn->close();

            $_SESSION["user"] = new user($email, true);

            echo 1;
        } else {
            echo 0;
        }
    }

    function insertNewAddress($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            if (validateAddress()['varos'] != "") {
                $csengo = null;
                $emelet = null;
                $ajto = null;

                if ($_POST["csengo"] != "") {
                    $csengo = $_POST["csengo"];
                }

                if ($_POST["emelet"] != "") {
                    $emelet = $_POST["emelet"];
                }

                if ($_POST["ajto"] != "") {
                    $ajto = $_POST["ajto"];
                }

                $sql = "INSERT INTO cim(megrendeloId, varos, iranyitoszam, utca, hazszam, emelet, ajto, kapucsengo) VALUES(?, ?, ?, ?, ?, ?, ?, ?);";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssssssss", $email, validateAddress()["varos"], validateAddress()["irsz"], validateAddress()["utca"], validateAddress()["hsz"], $emelet, $ajto, $csengo);
                $stmt->execute();

                $conn->close();

                echo 1;
            } else {
                echo "invalidAddress";
            }
        } else {
            echo 0;
        }
    }

    function validateAddress() {
        $result = array(
            'varos' => "",
            'irsz' => "",
            'utca' => "",
            'hsz' => ""
        );

        $api_endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
        $key = 'AIzaSyBCvrON5AS4aSRxJcSbnszCA1NUWTGF00U';

        $address = $_POST["city"]." ".$_POST["irsz"].", ".$_POST["utca"]." ".$_POST["kozterulet-tipus"]." ".$_POST["hsz"].", HU";

        $params = array(
            'address' => $address,
            'key' => $key
        );

        $resquest_url = $api_endpoint . '?' . http_build_query($params);

        $response = file_get_contents($resquest_url);

        $data = json_decode($response, true);

        if ($data['status'] === 'OK') {
            $result['varos'] = $data['results'][0]["address_components"][3]["long_name"];
            $result['irsz'] = $data['results'][0]["address_components"][5]["long_name"];
            $result['utca'] = $data['results'][0]["address_components"][1]["long_name"];
            $result['hsz'] = $data['results'][0]["address_components"][0]["long_name"];
        }

        return $result;
    }

    function getProfileData($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("uft8");

            $sql = "SELECT CONCAT(vezeteknev, ' ', keresztnev) AS 'nev', email, telefonszam FROM megrendelo WHERE email LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $reader = $stmt->get_result();

            $row = $reader->fetch_assoc();

            $conn->close();

            echo json_encode($row);
        } else {
            echo 0;
        }
    }

    function pwMod($email, $pw) {
        if ($pw != "") {
            $conn = new mysqli("localhost", "root", "", "foodorder");

            if (!$conn->connect_error) {
                $conn->set_charset("utf8");

                $pwSHA256 = hash("sha256", $pw);
                
                $sql = "UPDATE megrendelo SET jelszo = ? WHERE email LIKE ?;";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $pwSHA256, $email);
                $stmt->execute();

                $conn->close();

                echo 1;
            }
        } else {
            echo 0;
        }
    }

    function getRestaurantItems($rest) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("uft8");

            $sql = "SELECT nev, ar FROM etel WHERE etteremId LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $rest);
            $stmt->execute();

            $reader = $stmt->get_result();
            $rows = array();

            while ($row = $reader->fetch_assoc()) {
                $rows[] = $row;
            }

            $conn->close();

            echo json_encode($rows);
        } else {
            echo 0;
        }
    }

    function itemsToOrder() {
        if ($_POST["d"] != "" || count($_POST["d"]) != 0) {
            $_SESSION["order"]->setItems(json_decode($_POST["d"]));

            echo 1;
        } else {
            echo 0;
        }
    }

    function checkActiveOrder() {
        if (isset($_SESSION["order"])) {
            echo 1;
        } else {
            echo 0;
        }
    }

    function getRest() {
        if (isset($_SESSION["order"])) {
            echo $_SESSION["order"]->getRestaurant();
        } else {
            echo 0;
        }
    }

    function getOrderData() {
        echo json_encode($_SESSION["order"]);
    }

    function getAddresses($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT id, varos, iranyitoszam, utca, hazszam, emelet, ajto, kapucsengo FROM cim WHERE megrendeloId LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $result = $stmt->get_result();
            $rows = array();

            while($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            echo json_encode($rows);
        } else {
            echo 0;
        }
    }

    function placeOrder($megrendelo, $cim, $etterem) {
        if ($_POST["cardnumber"] != "" && $_POST["kartyatulaj"] != "" && $_POST["biztkod"] != "" && $_POST["expirity"] != "") {
            $conn = new mysqli("localhost", "root", "", "foodorder");

            if (!$conn->connect_error) {
                $conn->set_charset("utf8");

                $sql = "INSERT INTO rendeles(megrendeloId, cimId, futarId, etteremId, allapot, teljesitett) VALUES(?, ?, NULL, ?, -1, NULL);";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sss", $megrendelo, $cim, $etterem);
                $stmt->execute();

                $conn->close();

                insertItemsToCart($_SESSION["order"]->getItems(), $megrendelo);
            } else {
                echo 0;
            }
        }
    }

    function insertItemsToCart($items, $megrendelo) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "INSERT INTO kosar(rendelesId, tetelId, darab) VALUES((SELECT rendeles.id FROM rendeles WHERE megrendeloId LIKE ? AND allapot = -1 AND teljesitett IS NULL), ?, ?)";

            $stmt = $conn->prepare($sql);

            for($i = 0; $i < count($items); $i++) {
                $stmt->bind_param("ssi", $megrendelo, $items[$i]->key, $items[$i]->value);
                $stmt->execute();
            }

            $stmt->close();
            $conn->close();

            echo 1;
        } else {
            echo 0;
        }
    }

    function getAddressState($userEmail) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT CONCAT(cim.varos, ' ', cim.iranyitoszam, ', ', cim.utca, ' ', cim.hazszam) AS 'cim', futar.poz_lat AS 'futarpozlat', futar.poz_lng AS 'futarpozlng', etterem.poz_lat AS 'restpozlat', etterem.poz_lng AS 'restpozlng', futarId, allapot
            FROM rendeles
                INNER JOIN cim ON rendeles.cimId = cim.id
                LEFT JOIN futar ON rendeles.futarId = futar.email
                INNER JOIN etterem ON rendeles.etteremId = etterem.nev
            WHERE rendeles.megrendeloId LIKE ? AND teljesitett IS NULL
            LIMIT 1;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $userEmail);
            $stmt->execute();

            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                
                if ($row["futarId"] != null) {
                    $_SESSION["orderData"] = $row;
                }

                echo json_encode($row);
            } else {
                echo json_encode("done");
                unset($_SESSION["order"]);
            }
        } else {
            echo 0;
        }
    }

    function vaneAktivRendelese($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("uft8");

            $sql = "SELECT id FROM rendeles WHERE megrendeloId LIKE ? AND teljesitett IS NULL;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $email);
            $stmt->execute();

            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                echo 1;
            } else {
                echo 0;
            }

            $conn->close();
        }
    }

    function selectOrders($email) {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("uft8");

            $sql = "SELECT etterem.nev AS 'rest', DATE_FORMAT(rendeles.teljesitett, '%Y-%m-%d') AS 'datum' FROM rendeles INNER JOIN etterem ON rendeles.etteremId = etterem.nev WHERE megrendeloId LIKE ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $reader = $stmt->get_result();
            $rows = array();

            while ($row = $reader->fetch_assoc()) {
                $rows[] = $row;
            }

            echo json_encode($rows);
        } else {
            echo 0;
        }
    }

    //Unit test methods
    function testDbconnection() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->close();

            echo 1;
        } else {
            echo 0;
        }
    }

    function selectDataTest() {
        $conn = new mysqli("localhost", "root", "", "foodorder");

        if (!$conn->connect_error) {
            $conn->set_charset("utf8");

            $sql = "SELECT nev FROM etterem WHERE nev LIKE 'Döner Kebab Budapest';";

            $result = $conn->query($sql);

            $conn->close();

            $row = $result->fetch_assoc();

            echo json_encode($row);
        } else {
            echo 0;
        }
    }
    
    exit();
?>